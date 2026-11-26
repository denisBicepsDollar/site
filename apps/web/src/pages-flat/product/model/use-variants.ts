export function useVariants(variants) {


    const parseSize = (str) => parseInt(str, 10)

    const sortedVariants = [...variants].sort((a, b) => {
        const aAvailable = a.stock > 0 ? 1 : 0;
        const bAvailable = b.stock > 0 ? 1 : 0;
        if (aAvailable !== bAvailable) {
            return bAvailable - aAvailable;
        }

        return parseSize(a.name) - parseSize(b.name);
    });
    console.log(sortedVariants);
    return {sortedVariants}
}