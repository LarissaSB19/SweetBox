import { test, expect } from '@playwright/test';

test.describe('Caso de Teste 03 - Pagamento do Pedido', () => {

  test('Pagamento via Pix com sucesso', async ({ page }) => {

    // LOGIN FAKE
    await page.addInitScript(() => {

      sessionStorage.setItem(
        'usuario',
        JSON.stringify({
          idUsuario: 1,
          nome: 'Larissa',
          email: 'lissa@gmail.com',
          idPerfil: 1
        })
      );

      sessionStorage.setItem(
        'token',
        'token-fake'
      );

      sessionStorage.setItem(
        'isAuthenticated',
        'true'
      );

    });

    // ABRIR PÁGINA PEDIDO
    await page.goto('http://localhost:5173/pedido');

    await page.waitForLoadState('domcontentloaded');

    // VALIDAR TELA
    await expect(
      page.getByText('Monte seu Pedido')
    ).toBeVisible();

    // SCREENSHOT INICIAL
    await page.screenshot({
      path: 'evidencias/P-01-pagina-pedidos.png',
      fullPage: true
    });

    // ABRIR PRODUTO
    await page.locator('.card-hover').first().click();

    // SELECIONAR TAMANHO
    await page.selectOption('#tamanho', { index: 1 });

    // SELECIONAR MASSA
    await page.selectOption('#massa', { index: 1 });

    // SELECIONAR RECHEIOS
    await page.getByTestId('recheio1')
      .getByText(/^Ninho\s*$/)
      .click();

    await page.getByTestId('recheio2')
      .getByText(/^Morango\s*$/)
      .click();

    // SCREENSHOT PRODUTO
    await page.screenshot({
      path: 'evidencias/P-02-produto-selecionado.png',
      fullPage: true
    });

    // ADICIONAR AO CARRINHO
    await page.getByText('Adicionar').click();

    // ABRIR CARRINHO
    await page.getByText('🛒').click();

    // FINALIZAR PEDIDO
    await page.getByText('Finalizar Pedido').click();

    // VALIDAR TELA
    await expect(
      page.getByText('Finalizar Pedido')
    ).toBeVisible();

    // SELECIONAR DATA
    const hoje = new Date();

    hoje.setDate(hoje.getDate() + 5);

    const data = hoje.toISOString().split('T')[0];

    await page.fill('#dataEntrega', data);

    // SELECIONAR HORÁRIO
    await page.getByText('07:00').click();

    // SCREENSHOT FINALIZAÇÃO
    await page.screenshot({
      path: 'evidencias/P-03-finalizacao.png',
      fullPage: true
    });

    // IR PARA PAGAMENTO
    await page.getByText('Ir para Pagamento').click();

    // VALIDAR TELA PAGAMENTO
    await expect(
      page.getByText('Forma de pagamento')
    ).toBeVisible();

    // SCREENSHOT PAGAMENTO
    await page.screenshot({
      path: 'evidencias/P-04-pagamento.png',
      fullPage: true
    });

    // PAGAMENTO PIX
    await page.click('#btnPix');

    // CONFIRMAR PAGAMENTO
    await page.click('#confirmarPagamento');

    await page.waitForURL(/pedidoConfirmado/);

    await page.screenshot({
        path: 'evidencias/P-05-pedido-confirmado.png',
        fullPage: true
    });

    // LOGS
    console.log('Pagamento PIX confirmado com sucesso.');

  });

  test('Erro ao confirmar pagamento sem selecionar forma de pagamento', async ({ page }) => {

    // LOGIN FAKE
    await page.addInitScript(() => {

      sessionStorage.setItem(
        'usuario',
        JSON.stringify({
          idUsuario: 1,
          nome: 'Larissa',
          email: 'lissa@gmail.com',
          idPerfil: 1
        })
      );

      sessionStorage.setItem(
        'token',
        'token-fake'
      );

      sessionStorage.setItem(
        'isAuthenticated',
        'true'
      );

    });

    // ABRIR PÁGINA PEDIDO
    await page.goto('http://localhost:5173/pedido');

    await page.waitForLoadState('domcontentloaded');

    // VALIDAR TELA
    await expect(
      page.getByText('Monte seu Pedido')
    ).toBeVisible();

    // ABRIR PRODUTO
    await page.locator('.card-hover').first().click();

    // SELECIONAR TAMANHO
    await page.selectOption('#tamanho', { index: 1 });

    // SELECIONAR MASSA
    await page.selectOption('#massa', { index: 1 });

    // SELECIONAR RECHEIOS
    await page.getByTestId('recheio1')
      .getByText(/^Ninho\s*$/)
      .click();

    await page.getByTestId('recheio2')
      .getByText(/^Morango\s*$/)
      .click();

    // ADICIONAR AO CARRINHO
    await page.getByText('Adicionar').click();

    // ABRIR CARRINHO
    await page.getByText('🛒').click();

    // FINALIZAR PEDIDO
    await page.getByText('Finalizar Pedido').click();

    // SELECIONAR DATA
    const hoje = new Date();

    hoje.setDate(hoje.getDate() + 5);

    const data = hoje.toISOString().split('T')[0];

    await page.fill('#dataEntrega', data);

    // SELECIONAR HORÁRIO
    await page.getByText('07:00').click();

    // IR PARA PAGAMENTO
    await page.getByText('Ir para Pagamento').click();

    // VALIDAR TELA PAGAMENTO
    await expect(
      page.getByText('Forma de pagamento')
    ).toBeVisible();

    // SCREENSHOT ERRO
    await page.screenshot({
      path: 'evidencias/P-06-erro-pagamento.png',
      fullPage: true
    });

    // NÃO SELECIONAR FORMA DE PAGAMENTO

    // CONFIRMAR PAGAMENTO
    await page.click('#confirmarPagamento');

    // VALIDAR MENSAGEM DE ERRO
    await expect(
      page.getByText(
        'Selecione uma forma de pagamento para continuar.'
      )
    ).toBeVisible();

    // SCREENSHOT DA MENSAGEM
    await page.screenshot({
    path: 'evidencias/05-erro-pagamento.png',
    fullPage: true
    });

    // LOGS
    console.log('Erro validado com sucesso.');
    console.log('Mensagem exibida corretamente.');

  });

});