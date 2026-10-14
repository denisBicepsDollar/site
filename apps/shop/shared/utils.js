

export const NO_IMAGE = '../images/no-image.svg';

export function safeImage(src) {
    return src || NO_IMAGE;
}
