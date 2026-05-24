

export const NO_IMAGE = '../images/no-image.jpg';

export function safeImage(src) {
    return src || NO_IMAGE;
}
