export function mergePdfDefaults(currentData, defaultData) {
    const baseData = currentData && typeof currentData === 'object' ? currentData : {}

    return Object.entries(defaultData).reduce((acc, [key, value]) => {
        const currentValue = acc[key]

        if (Array.isArray(value)) {
            if (Array.isArray(currentValue) && currentValue.length > 0) {
                return acc
            }

            return {
                ...acc,
                [key]: [...value],
            }
        }

        if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
            return acc
        }

        return {
            ...acc,
            [key]: value,
        }
    }, { ...baseData })
}
