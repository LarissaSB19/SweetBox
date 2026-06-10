import { test, expect } from '@playwright/test';

test.describe('Cadastro de Produtos - SweetBox', () => {

  test('Cadastrar produto com sucesso', async ({ page }) => {

    await page.goto('http://localhost:5173/gerenciarProdutos');

    // Evidência 1
    await page.screenshot({
      path: 'evidencias/GP-01-tela-inicial.png',
      fullPage: true
    });

    // Validar tela
    await expect(
      page.getByText('Gerenciamento dos Produtos')
    ).toBeVisible();

    // Abrir modal
    await page.getByRole('button', { name: 'Cadastrar Produto' }).click();

    // Validar modal
    await expect(
        page.getByRole('heading', { name: 'Cadastrar Produto' })
    ).toBeVisible();

    // Preencher dados
    await page.locator('input[name="nomeProduto"]')
      .fill('Bolo');

    await page.locator('input[name="preco"]')
      .fill('90');

    await page.locator('textarea[name="descricao"]')
      .fill('Bolo recheado');

    await page.locator('select[name="idCategoria"]')
      .selectOption('1');

    // Evidência 2
    await page.screenshot({
      path: 'evidencias/GP-02-produto-preenchido.png',
      fullPage: true
    });

    // Salvar
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(
        page.getByText('Produto cadastrado.')
    ).toBeVisible();

    // Aguarda atualização da tabela
    await page.waitForTimeout(1000);

    // Validar produto na lista
    await expect(
      page.getByText('Bolo').first()
    ).toBeVisible();

    // Evidência 3
    await page.screenshot({
      path: 'evidencias/GP-03-produto-cadastrado.png',
      fullPage: true
    });

    console.log('Produto cadastrado com sucesso.');

  });

  test('Erro ao cadastrar produto sem preencher campos obrigatórios', async ({ page }) => {

    await page.goto('http://localhost:5173/gerenciarProdutos');

    // Abrir modal
    await page.getByText('Cadastrar Produto').click();

    // Preencher apenas descrição
    await page.locator('textarea[name="descricao"]')
      .fill('Bolo recheado');

    // Evidência 4
    await page.screenshot({
      path: 'evidencias/GP-04-campos-incompletos.png',
      fullPage: true
    });

    // Tentar salvar
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(
        page.getByText('Preencha todos os campos obrigatórios.')
    ).toBeVisible();

    await expect(
      page.locator('input[name="nomeProduto"]')
    ).toBeVisible();

    // Evidência 5
    await page.screenshot({
      path: 'evidencias/GP-05-validacao-campos.png',
      fullPage: true
    });

    console.log('Validação de campos obrigatórios executada com sucesso.');

  });

});