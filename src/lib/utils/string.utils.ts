const getNumbersOnly = (value: string): string => value.replace(/\D/g, '');

const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 primeiros dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 6 primeiros dígitos
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen após os 9 primeiros dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 11 dígitos
};

const maskPhone = (value: string) => {
    const raw = value.replace(/\D/g, ''); // Remove tudo que não é número

    if (raw.length <= 10) {
        // Formato Fixo: (47) 3333-3333
        return raw
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    } else {
        // Formato Celular: (47) 99825-0257
        return raw
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }
};

export { getNumbersOnly, maskCPF, maskPhone };
