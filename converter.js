// converter.js

function validateNumber(system, str) {
    const maps = {
        binary: /^[01]+$/,
        octal: /^[0-7]+$/,
        decimal: /^[0-9]+$/,
        hex: /^[0-9A-Fa-f]+$/
    };
    return maps[system]?.test(str.trim());
}

// Convert to Decimal
function toDecimal(str, base) {
    let steps = [];
    let result = 0;
    const chars = str.toUpperCase().trim().split('').reverse();

    const hexMap = {
        'A': 10, 'B': 11, 'C': 12,
        'D': 13, 'E': 14, 'F': 15
    };

    chars.forEach((char, i) => {
        const digit = isNaN(char) ? hexMap[char] : parseInt(char);
        const power = Math.pow(base, i);
        const value = digit * power;
        steps.push(`${char} × ${base}^${i} = ${value}`);
        result += value;
    });

    return { result, steps };
}

// Convert from Decimal
function fromDecimal(decimal, base) {
    const hexMap = "0123456789ABCDEF";
    let steps = [];
    let digits = [];

    if (decimal === 0) {
        return { result: "0", steps: ["0 ÷ " + base + " = 0, remainder = 0"] };
    }

    let num = decimal;

    while (num > 0) {
        let remainder = num % base;
        steps.push(`${num} ÷ ${base} = ${Math.floor(num / base)}, remainder = ${remainder}`);
        digits.unshift(hexMap[remainder]);
        num = Math.floor(num / base);
    }

    return { result: digits.join(""), steps };
}

// Main conversion router
function convertNumber(inputStr, fromBase, toBase) {
    const baseMap = { binary: 2, octal: 8, decimal: 10, hex: 16 };
    let steps = [];

    if (!validateNumber(fromBase, inputStr)) {
        return { error: `Invalid ${fromBase} number.` };
    }

    let decimal = 0;
    if (fromBase === "decimal") {
        decimal = parseInt(inputStr);
        steps.push(`Input is already in decimal: ${decimal}`);
    } else {
        let { result, steps: s1 } = toDecimal(inputStr, baseMap[fromBase]);
        decimal = result;
        steps = s1;
    }

    if (toBase === "decimal") {
        steps.push(`Final decimal result: ${decimal}`);
        return { result: String(decimal), steps };
    } else {
        let { result, steps: s2 } = fromDecimal(decimal, baseMap[toBase]);
        return { result, steps: steps.concat(["→ Convert to target base:"], s2) };
    }
}
