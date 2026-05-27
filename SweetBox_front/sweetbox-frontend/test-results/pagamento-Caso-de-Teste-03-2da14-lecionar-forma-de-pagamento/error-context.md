# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pagamento.spec.js >> Caso de Teste 03 - Pagamento do Pedido >> Erro ao confirmar pagamento sem selecionar forma de pagamento
- Location: tests\pagamento.spec.js:136:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 6

- Selecione uma forma de pagamento para continuar.
+
+     💳 Pagamento🧾 ResumoBolo1x R$ 90.00• PP• Chocolate• Ninho• Morango📅 Data da retirada: 01/06/2026⏰ Horário: 07:00TotalR$ 90.00Forma de pagamento💵 Pagar na retirada📱 PIX✅ Confirmar Pagamento
+     
+   
+
+

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    14 × locator resolved to <body>…</body>
       - unexpected value "
    💳 Pagamento🧾 ResumoBolo1x R$ 90.00• PP• Chocolate• Ninho• Morango📅 Data da retirada: 01/06/2026⏰ Horário: 07:00TotalR$ 90.00Forma de pagamento💵 Pagar na retirada📱 PIX✅ Confirmar Pagamento
    
  

"

```

```yaml
- heading "💳 Pagamento" [level=1]
- heading "🧾 Resumo" [level=2]
- text: Bolo 1x R$ 90.00 • PP • Chocolate • Ninho • Morango
- paragraph:
  - strong: "📅 Data da retirada:"
  - text: 01/06/2026
- paragraph:
  - strong: "⏰ Horário:"
  - text: 07:00
- strong: Total
- strong: R$ 90.00
- heading "Forma de pagamento" [level=2]
- button "💵 Pagar na retirada"
- button "📱 PIX"
- button "✅ Confirmar Pagamento"
```

# Test source

```ts
  134 |   });
  135 | 
  136 |   test('Erro ao confirmar pagamento sem selecionar forma de pagamento', async ({ page }) => {
  137 | 
  138 |     // LOGIN FAKE
  139 |     await page.addInitScript(() => {
  140 | 
  141 |       sessionStorage.setItem(
  142 |         'usuario',
  143 |         JSON.stringify({
  144 |           idUsuario: 1,
  145 |           nome: 'Larissa',
  146 |           email: 'lissa@gmail.com',
  147 |           idPerfil: 1
  148 |         })
  149 |       );
  150 | 
  151 |       sessionStorage.setItem(
  152 |         'token',
  153 |         'token-fake'
  154 |       );
  155 | 
  156 |       sessionStorage.setItem(
  157 |         'isAuthenticated',
  158 |         'true'
  159 |       );
  160 | 
  161 |     });
  162 | 
  163 |     // ABRIR PÁGINA PEDIDO
  164 |     await page.goto('http://localhost:5173/pedido');
  165 | 
  166 |     await page.waitForLoadState('domcontentloaded');
  167 | 
  168 |     // VALIDAR TELA
  169 |     await expect(
  170 |       page.getByText('Monte seu Pedido')
  171 |     ).toBeVisible();
  172 | 
  173 |     // ABRIR PRODUTO
  174 |     await page.locator('.card-hover').first().click();
  175 | 
  176 |     // SELECIONAR TAMANHO
  177 |     await page.selectOption('#tamanho', { index: 1 });
  178 | 
  179 |     // SELECIONAR MASSA
  180 |     await page.selectOption('#massa', { index: 1 });
  181 | 
  182 |     // SELECIONAR RECHEIOS
  183 |     await page.getByTestId('recheio1')
  184 |       .getByText(/^Ninho\s*$/)
  185 |       .click();
  186 | 
  187 |     await page.getByTestId('recheio2')
  188 |       .getByText(/^Morango\s*$/)
  189 |       .click();
  190 | 
  191 |     // ADICIONAR AO CARRINHO
  192 |     await page.getByText('Adicionar').click();
  193 | 
  194 |     // ABRIR CARRINHO
  195 |     await page.getByText('🛒').click();
  196 | 
  197 |     // FINALIZAR PEDIDO
  198 |     await page.getByText('Finalizar Pedido').click();
  199 | 
  200 |     // SELECIONAR DATA
  201 |     const hoje = new Date();
  202 | 
  203 |     hoje.setDate(hoje.getDate() + 5);
  204 | 
  205 |     const data = hoje.toISOString().split('T')[0];
  206 | 
  207 |     await page.fill('#dataEntrega', data);
  208 | 
  209 |     // SELECIONAR HORÁRIO
  210 |     await page.getByText('07:00').click();
  211 | 
  212 |     // IR PARA PAGAMENTO
  213 |     await page.getByText('Ir para Pagamento').click();
  214 | 
  215 |     // VALIDAR TELA PAGAMENTO
  216 |     await expect(
  217 |       page.getByText('Forma de pagamento')
  218 |     ).toBeVisible();
  219 | 
  220 |     // SCREENSHOT ERRO
  221 |     await page.screenshot({
  222 |       path: 'evidencias/P-06-erro-pagamento.png',
  223 |       fullPage: true
  224 |     });
  225 | 
  226 |     // NÃO SELECIONAR FORMA DE PAGAMENTO
  227 | 
  228 |     // CONFIRMAR PAGAMENTO
  229 |     await page.click('#confirmarPagamento');
  230 | 
  231 |     // VALIDAR MENSAGEM DE ERRO
  232 |     await expect(
  233 |       page.locator('body')
> 234 |     ).toContainText(
      |       ^ Error: expect(locator).toContainText(expected) failed
  235 |       'Selecione uma forma de pagamento para continuar.'
  236 |     );
  237 | 
  238 |     // SCREENSHOT DA MENSAGEM
  239 |     await page.screenshot({
  240 |     path: 'evidencias/05-erro-pagamento.png',
  241 |     fullPage: true
  242 |     });
  243 | 
  244 |     // LOGS
  245 |     console.log('Erro validado com sucesso.');
  246 |     console.log('Mensagem exibida corretamente.');
  247 | 
  248 |   });
  249 | 
  250 | });
```