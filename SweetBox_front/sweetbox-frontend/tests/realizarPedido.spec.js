import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo de Pedido SweetBox', () => {

  test('Realizar pedido com sucesso', async ({ page }) => {

    // Login fake
    await page.addInitScript(() => {

      sessionStorage.setItem(
        'usuario',
        JSON.stringify({
          idUsuario: 1,
          nome: 'Larissa'
        })
      );

    });

    // Abrir pedidos
    await page.goto('http://localhost:5173/pedido');

    // Validar página
    await expect(page.getByText('Monte seu Pedido'))
      .toBeVisible();

    // Abrir primeiro produto
    await page.locator('.card-hover').first().click();

    // Selecionar tamanho
    await page.selectOption('#tamanho', { index: 1 });

    // Selecionar massa
    await page.selectOption('#massa', { index: 1 });

    await page.getByTestId('recheio1')
        .getByText(/^Ninho\s*$/)
        .click();

    await page.getByTestId('recheio2')
        .getByText(/^Morango\s*$/)
        .click();

    // Adicionar ao carrinho
    await page.getByText('Adicionar').click();

    // Abrir carrinho
    await page.getByText('🛒').click();

    // Finalizar pedido
    await page.getByText('Finalizar Pedido').click();

    // Validar tela finalização
    await expect(page.getByText('Finalizar Pedido'))
      .toBeVisible();

    // Selecionar data
    const hoje = new Date();

    hoje.setDate(hoje.getDate() + 5);

    const data = hoje.toISOString().split('T')[0];

    await page.fill('#dataEntrega', data);

    // Selecionar horário
    await page.getByText('07:00').click();

    // Ir pagamento
    await page.getByText('Ir para Pagamento').click();

    // Validar tela pagamento
    await expect(page.getByText('Forma de pagamento'))
      .toBeVisible();

    // Escolher PIX
    await page.click('#btnPix');

    // Confirmar pagamento
    await page.click('#confirmarPagamento');

    // Esperar navegação
    await page.waitForURL(/pedidoConfirmado/);

    // Screenshot evidência
    await page.screenshot({
      path: 'evidencias/pedido-sucesso.png',
      fullPage: true
    });

  });

});