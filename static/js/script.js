document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshIcon = document.getElementById('refresh-icon');
    const loader = document.getElementById('loader');
    const notesContainer = document.getElementById('notes-container');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    const fetchNotes = async () => {
        // UI Updates for loading
        refreshIcon.classList.add('spin');
        loader.classList.remove('hidden');
        notesContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        notesContainer.innerHTML = '';

        try {
            const response = await fetch('/api/notes');
            const data = await response.json();

            if (data.status === 'success') {
                if (data.notes.length === 0) {
                    showError("No updates found.");
                } else {
                    renderNotes(data.notes);
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

            // Extract plain text for tweet
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            let plainTextContent = tempDiv.textContent || tempDiv.innerText || "";
            
            // Clean extra whitespace
            plainTextContent = plainTextContent.replace(/\s+/g, ' ').trim();
            
            // Truncate for twitter (Twitter limit 280, minus url length and other text)
            if (plainTextContent.length > 130) {
                plainTextContent = plainTextContent.substring(0, 130) + '...';
            }

            const tweetText = encodeURIComponent(`Google BigQuery Update: ${note.title}\n\n${plainTextContent}`);
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
                    <a href="${tweetUrl}" target="_blank" rel="noopener noreferrer" class="tweet-btn" aria-label="Tweet about this update">
                        <i class="fa-brands fa-twitter"></i> Tweet Update
                    </a>
                    ${note.link ? `<a href="${note.link}" target="_blank" rel="noopener noreferrer" class="read-more">Read Full Note &rarr;</a>` : ''}
                </div>
            `;
            notesContainer.appendChild(card);
        });
        notesContainer.classList.remove('hidden');
    };

    refreshBtn.addEventListener('click', fetchNotes);

    // Initial fetch
    fetchNotes();
});
