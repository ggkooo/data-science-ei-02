# Dashboard de Estatística para Sensores Ambientais

Aplicação web em React + TypeScript para análise estatística de arquivos CSV com dados de sensores.

O sistema permite selecionar uma variável (Temperatura, Umidade, Ruído, eCO2 e TVOC), montar distribuição por classes e calcular medidas descritivas com o método de dados agrupados utilizado em sala.

## Screenshot

![Screenshot da aplicação](README-img/application.png)

## Funcionalidades

- Upload de CSV por clique ou arrastar e soltar
- Leitura e validação automática dos campos numéricos
- Seleção de variável para análise
- Construção de tabela por classes com:
  - intervalos de classe
  - ponto médio ($x_i$)
  - frequência absoluta ($f_i$)
  - frequência acumulada ($F_i$)
  - coluna $f_i x_i$
  - coluna $f_i x_i^2$
- Cálculo de medidas para dados agrupados:
  - média
  - mediana
  - moda
  - variância populacional
  - desvio padrão populacional
  - coeficiente de variação
- Gráficos:
  - histograma
  - ogiva
- Interface responsiva (desktop e mobile)
- Interface traduzida para português (pt-BR)

## Método Estatístico Implementado

As fórmulas foram alinhadas ao método de tabela de classes da disciplina:

- Amplitude total: $AT = x_{max} - x_{min}$
- Amplitude de classe: $h = \frac{AT}{\sqrt{n}}$ (com arredondamento)
- Número de classes: $k = \left\lceil \frac{AT}{h} \right\rceil$
- Média: $\bar{x} = \frac{\sum f_i x_i}{n}$
- Mediana (agrupada): $Md = L_i + \left(\frac{\frac{n}{2} - F_{ant}}{f_i}\right) h$
- Moda (agrupada): $Mo = L_i + \left(\frac{d_1}{d_1 + d_2}\right) h$
- Variância populacional: $\sigma^2 = \frac{\sum f_i x_i^2}{n} - \bar{x}^2$
- Desvio padrão: $\sigma = \sqrt{\sigma^2}$
- Coeficiente de variação: $CV = \frac{\sigma}{\bar{x}} \cdot 100$

## Alterações Recentes

- Ajuste dos cálculos para dados agrupados por classes
- Troca do método anterior por variância e desvio padrão populacionais
- Inclusão das colunas $f_i x_i$ e $f_i x_i^2$ na tabela
- Remoção de frequência relativa, frequência relativa acumulada e barra de distribuição da tabela
- Tradução dos textos da interface para português
- Alteração do favicon para o emoji de calculadora (🖩)

## Tecnologias

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Papa Parse
- Recharts

## Como Executar

1. Instale as dependências

```bash
npm install
```

2. Rode em desenvolvimento

```bash
npm run dev
```

3. Gere o build de produção

```bash
npm run build
```

4. Visualize o build

```bash
npm run preview
```

## Formato Esperado do CSV

Colunas suportadas:

- `payload.temperature`
- `payload.humidity`
- `payload.noise`
- `payload.eco2`
- `payload.tvoc`
- `payload.timestamp`
- `payload.sector`
- `payload.device`

Linhas com valores numéricos inválidos para as variáveis analisadas são descartadas.

## Autor

- Giordano Bruno Biasi Berwig
