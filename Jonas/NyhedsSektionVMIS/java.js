const newsContainer = document.getElementById("newsContainer");
const newsModal = document.getElementById("newsModal");
const newsModalContent = document.getElementById("newsModalContent");
const closeModalBtn = document.getElementById("closeModalBtn");

const siteUrl = "https://vmsynnejysk.dk";
const postsUrl = `${siteUrl}/wp-json/wp/v2/posts?_embed&per_page=6`;

async function fetchNews() {
    try {
        const response = await fetch(postsUrl);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const posts = await response.json();

        posts.sort((a, b) => {
            const dateA = getDateFromTags(a) || new Date(a.date);
            const dateB = getDateFromTags(b) || new Date(b.date);

            return dateB - dateA;
        });

        newsContainer.innerHTML = "";

        posts.forEach(post => {
            const title = post.title.rendered;
            const excerpt = stripHtml(post.excerpt.rendered, 120);
            const tagDate = getDateFromTags(post);
            const date = tagDate ? formatDate(tagDate) : formatDate(post.date);
            const image = getFeaturedImage(post);
            const youtubeId = getYoutubeIdFromTags(post);

            const article = document.createElement("article");
            article.classList.add("newsCard");
            article.dataset.id = post.id;

            article.innerHTML = `
                <div class="newsMedia">
                    ${
                        youtubeId
                            ? `
                            <div class="videoThumbnail">
                                <img 
                                    src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg" 
                                    alt="${title}" 
                                    class="newsImage"
                                >
                                <div class="playButton">▶</div>
                            </div>
                            `
                            : image
                                ? `<img src="${image}" alt="${title}" class="newsImage">`
                                : `<div class="newsImage newsImagePlaceholder"></div>`
                    }
                </div>

                <div class="newsContent">
                    <h2 class="newsTitle">${title}</h2>
                    <p class="newsExcerpt">${excerpt}</p>
                    <div class="newsDate">${date}</div>
                </div>
            `;

            article.addEventListener("click", () => openModal(post.id));
            newsContainer.appendChild(article);
        });

    } catch (error) {
        console.error("Fejl ved hentning af nyheder:", error);
        newsContainer.innerHTML = `<p>Kunne ikke hente nyheder.</p>`;
    }
}

async function openModal(postId) {
    try {
        const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts/${postId}?_embed`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const post = await response.json();

        const title = post.title.rendered;
        const content = post.content.rendered;
        const tagDate = getDateFromTags(post);
        const date = tagDate ? formatDate(tagDate) : formatDate(post.date);
        const image = getFeaturedImage(post);
        const youtubeId = getYoutubeIdFromTags(post);

        newsModalContent.innerHTML = `
            ${
                youtubeId
                    ? `
                    <div class="modalVideo">
                        <iframe
                            src="https://www.youtube.com/embed/${youtubeId}"
                            title="${title}"
                            frameborder="0"
                            allowfullscreen>
                        </iframe>
                    </div>
                    `
                    : image
                        ? `<img src="${image}" alt="${title}" class="modalImage">`
                        : ""
            }

            <h2 class="modalTitle">${title}</h2>
            <div class="modalDate">${date}</div>
            <div class="modalText">${content}</div>
        `;

        newsModal.classList.add("active");
        document.body.style.overflow = "hidden";

    } catch (error) {
        console.error("Fejl ved hentning af post:", error);
    }
}

function closeModal() {
    newsModal.classList.remove("active");
    document.body.style.overflow = "";
}

function getFeaturedImage(post) {
    return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

function getYoutubeIdFromTags(post) {
    const terms = post?._embedded?.["wp:term"] || [];
    const allTerms = terms.flat();

    for (const term of allTerms) {
        if (!term.name) continue;

        const match = term.name.match(/^yt-(.+)$/);

        if (match) {
            return match[1];
        }
    }

    return null;
}

function getDateFromTags(post) {
    const terms = post?._embedded?.["wp:term"] || [];
    const allTerms = terms.flat();

    for (const term of allTerms) {
        if (!term.name) continue;

        const match = term.name.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

        if (match) {
            const day = match[1];
            const month = match[2];
            const year = match[3];

            return new Date(`${year}-${month}-${day}T00:00:00`);
        }
    }

    return null;
}

function formatDate(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    return date.toLocaleDateString("da-DK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function stripHtml(html, maxLength = 140) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const text = temp.textContent || temp.innerText || "";

    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }

    return text;
}

closeModalBtn.addEventListener("click", closeModal);

newsModal.addEventListener("click", (e) => {
    if (e.target === newsModal) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

fetchNews();