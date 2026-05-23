

export const NO_IMAGE = '../images/no-image.jpg';

export function safeImage(src) {
    return src || NO_IMAGE;
}

export function handleImageError(imgElement) {
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = NO_IMAGE;
    };
}
