# EP2
## Pinball em 3D com WebGL


### Autores

Anderson Meirelles Freitas (NUSP: 8883719)
Rafael Will Macedo de Araujo (NUSP: 7261561)

Importante: dadas as atuais restrições de segurança dos navegadores, muitas vezes arquivos externos carregados via XMLHttpRequest não funcionam. Portanto, a aplicação pode ser visualizada sem problemas no link abaixo:

http://andersonfreitas.com/pinball/


### Instruções

Use as teclas `z` e `x` para comandar as paletas e `espaço` para disparar as esferas. O mouse movimenta a camera.

As teclas de direção do teclado podem ser usados para "cheat", pois como as vezes a esfera pode ficar travada devido ao problema de colisão, ela pode ser movimentada através desse artifício.

Os botões da interface permitem ajustar diversos controles, como até a escolha do integrador usado.

### Colisão e Física

A colisão é feita com todas as faces da cena. A cena é composta por objetos dinâmicos (esferas) que se movimentam e os estáticos ativos (mesa) e não ativos (domo e piso).

O algoritmo de colisão basicamente testa para cada triangulo se a distância entre o centro da esfera e o vértice mais próximo do triangulo, se a distância ao quadrado for menor que o raio da esfera ao quadrado é considerado uma colisão. O algoritmo de detecção não conhece a normal da face.

Depois da colisão detectada com a face, a reação da colisão é calculada olhando a normal da face, onde a forca é refletida e acumulada com as outras forças da cena.

As principais forças consideradas são a gravidade e o arrasto criado pela densidade do ar (calculado na temperatura de 15º e influenciado pela área da esfera), e ao colidir parte é absorvida pela parede com um coeficiente de restituição usado.

A integração numérica pode ser escolhida entre Euler, Verlet e Runge-Kutta de 4ª ordem, diferentes abordagens foram testadas pois o método de Euler se demonstrou muito instável.

### Observações

O projeto foi estruturado com classes, e algumas foram escritas originalmente na linguagem CoffeScript que é compilada em Javascript. Tive preferencia pela linguagem pela facilidade para se construtir classes.

## Bibliotecas externas

 - **[dat-gui](http://code.google.com/p/dat-gui/)**
Usado para criar os controles interativos da aplicação.
 - **[glMatrix](http://glmatrix.net)**
Biblioteca com operações para se trabalhar com matrizes, vetores e quaternions.
 - **[jQuery](http://jquery.com)**
Utilitário para acessar o DOM do HTML.
 - **[requestAnimationFrame](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)**
Polyfill para que a função `requestAnimationFrame` funcione em diversos browsers.
 - **[stats.js](https://github.com/mrdoob/stats.js)**
Métricas de desempenho da renderização (em fps/ms/Hz).
 - **[underscore.js](http://underscorejs.org)**
Provê diversos helpers para a linguagem javascript inspirado de linguagens funcionais. Traz funções como `map`, `reduce`, `each`, etc.
 - **[coffescript](http://coffeescript.org)**
Linguagem que compila para Javascript
