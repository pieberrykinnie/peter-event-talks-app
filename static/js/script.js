document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshIcon = document.getElementById('refresh-icon');
    const exportBtn = document.getElementById('export-btn');
    const loader = document.getElementById('loader');
    const notesContainer = document.getElementById('notes-container');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    let currentNotes = [];

    const fetchNotes = async () => {
        // UI Updates for loading
        refreshIcon.classList.add('spin');
        loader.classList.remove('hidden');
        notesContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        exportBtn.classList.add('hidden');
        notesContainer.innerHTML = '';
        currentNotes = [];

        try {
            const response = await fetch('/api/notes');
            const data = await response.json();

            if (data.status === 'success') {
                if (data.notes.length === 0) {
                    showError("No updates found.");
                } else {
                    currentNotes = data.notes;
                    renderNotes(currentNotes);
                    exportBtn.classList.remove('hidden');
                }
            } else {
                showError(data.message || "Failed to fetch updates.");
            }
        } catch (error) {
            showError("Network error while fetching updates.");
            console.error(error);
        } finally {
            refreshIcon.classList.remove('spin');
            loader.classList.add('hidden');
        }
    };

    const showError = (msg) => {
        errorText.textContent = msg;
        errorMessage.classList.remove('hidden');
        loader.classList.add('hidden');
        exportBtn.classList.add('hidden');
    };

    const renderNotes = (notes) => {
        notesContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.style.animationDelay = `${index * 0.1}s`;

            const dateStr = note.published ? new Date(note.published).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }) : 'No Date';

            // Extract plain text for copy/tweet
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            let plainTextContent = tempDiv.textContent || tempDiv.innerText || "";
            
            // Clean extra whitespace
            plainTextContent = plainTextContent.replace(/\s+/g, ' ').trim();
            
            // Truncate for twitter (Twitter limit 280, minus url length and other text)
            let tweetSnippet = plainTextContent;
            if (tweetSnippet.length > 130) {
                tweetSnippet = tweetSnippet.substring(0, 130) + '...';
            }

            const tweetText = encodeURIComponent(`Google BigQuery Update: ${note.title}\n\n${tweetSnippet}`);
            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(note.link)}`;

            card.innerHTML = `
                <div class="note-header">
                    <h2 class="note-title">${note.title}</h2>
                    <span class="note-date">${dateStr}</span>
                </div>
                <div class="note-content">
                    ${note.content}
                </div>
                <div class="note-footer">
                    <div class="footer-left">
                        <a href="${tweetUrl}" target="_blank" rel="noopener noreferrer" class="tweet-btn" aria-label="Tweet about this update">
                            <i class="fa-brands fa-twitter"></i> Tweet Update
                        </a>
                        <button class="copy-btn" aria-label="Copy update to clipboard">
                            <i class="fa-regular fa-copy"></i> <span>Copy</span>
                        </button>
                    </div>
                    ${note.link ? `<a href="${note.link}" target="_blank" rel="noopener noreferrer" class="read-more">Read Full Note &rarr;</a>` : ''}
                </div>
            `;

            // Add Copy to Clipboard logic
            const copyBtn = card.querySelector('.copy-btn');
            copyBtn.addEventListener('click', async () => {
                try {
                    const textToCopy = `Google BigQuery Update: ${note.title}\nDate: ${dateStr}\n\n${plainTextContent}\n\nRead more at: ${note.link}`;
                    await navigator.clipboard.writeText(textToCopy);
                    
                    const icon = copyBtn.querySelector('i');
                    const text = copyBtn.querySelector('span');
                    
                    icon.className = 'fa-solid fa-check';
                    text.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        icon.className = 'fa-regular fa-copy';
                        text.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            });

            notesContainer.appendChild(card);
        });
        notesContainer.classList.remove('hidden');
    };

    // Export to CSV logic
    exportBtn.addEventListener('click', () => {
        if (!currentNotes || currentNotes.length === 0) return;
        
        const headers = ['Title', 'Published Date', 'Content', 'Link'];
        const rows = currentNotes.map(note => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            const plainText = (tempDiv.textContent || tempDiv.innerText || "").replace(/\s+/g, ' ').trim();
            
            const escapeCSV = (text) => `"${(text || '').replace(/"/g, '""')}"`;
            
            return [
                escapeCSV(note.title),
                escapeCSV(note.published),
                escapeCSV(plainText),
                escapeCSV(note.link)
            ].join(',');
        });
        
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `bigquery_release_notes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    refreshBtn.addEventListener('click', fetchNotes);

    // Initial fetch
    fetchNotes();
});
