const fs = require('fs');

// Ler o arquivo com codificação latin1/windows-1252 devido aos acentos
const csvContent = fs.readFileSync('tabela.csv', 'latin1');
const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');

let servicosBaseStr = '        const servicosBase = [\n';
let idCounter = 1;

for (let i = 1; i < lines.length; i++) { // pula cabeçalho
    const cols = lines[i].split(';');
    if (cols.length >= 6) {
        const categoria = cols[0].trim();
        const nome = cols[2].trim();
        
        // Formatar preço: remove "R$", remove ".", troca "," por "." e converte para float
        const parsePreco = (p) => {
            if (!p) return 0;
            return parseFloat(p.replace(/R\$\s?/g, '').replace(/\./g, '').replace(/,/g, '.').trim()) || 0;
        };

        const preco1 = parsePreco(cols[3]);
        const preco2 = parsePreco(cols[4]);
        const preco3 = parsePreco(cols[5]);

        servicosBaseStr += `            { id: ${idCounter++}, categoria: "${categoria}", nome: "${nome}", preco1: ${preco1}, preco2: ${preco2}, preco3: ${preco3} },\n`;
    }
}
servicosBaseStr += '        ];';

// Atualizar orcamento.html
const htmlFile = 'orcamento.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

const regex = /const servicosBase = \[\s*[\s\S]*?\];/;
htmlContent = htmlContent.replace(regex, servicosBaseStr);

fs.writeFileSync(htmlFile, htmlContent, 'utf-8');
console.log('Atualizado com sucesso. Total de serviços:', idCounter - 1);
