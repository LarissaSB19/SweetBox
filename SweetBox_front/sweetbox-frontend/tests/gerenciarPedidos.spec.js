import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Pedidos - SweetBox', () => {

    test('Alterar status e visualizar detalhes do pedido', async ({ page }) => {

        // Abrir página
        await page.goto('http://localhost:5173/gerenciarPedidos');

        // Evidência 1
        await page.screenshot({
            path: 'evidencias/01-tela-gerenciamento.png',
            fullPage: true
        });

        // Validar título
        await expect(
            page.getByText('Gerenciamento de Pedidos')
        ).toBeVisible();

        // Validar se existe pedido
        await expect(
            page.locator('text=Pedido #').first()
        ).toBeVisible();

        // Filtrar pedidos pendentes
        await page.locator('select').selectOption('Pendente');


        // Aguarda a atualização da lista
        await page.waitForTimeout(500);

        // Evidência 2
        await page.screenshot({
            path: 'evidencias/02-pedidos-filtrados.png',
            fullPage: true
        });

        await page.getByText('Ver detalhes')
        .first()
        .click();

        // Validar modal
        await expect(
            page.getByText(/Itens do pedido/i)
        ).toBeVisible();

        // Evidência 3
        await page.screenshot({
            path: 'evidencias/03-detalhes-pedido.png',
            fullPage: true
        });

        // Fechar modal
        await page.getByRole('button', { name: 'Fechar' }).click();

        // Confirm dialog
        page.once('dialog', async dialog => {
            await dialog.accept();
        });

        // Alterar status
        await page.getByRole('button', { name: 'Preparar' })
            .first()
            .click();

        // Validar alteração
        await expect(
            page.locator('span, td, div')
                .filter({ hasText: 'Em Preparo' })
                .first()
        ).toBeVisible();

        // Evidência 4
        await page.screenshot({
            path: 'evidencias/04-status-alterado.png',
            fullPage: true
        });

    });

    test('Pesquisar pedido inexistente', async ({ page }) => {

        // Abrir página
        await page.goto('http://localhost:5173/gerenciarPedidos');

        // Evidência 5
        await page.screenshot({
            path: 'evidencias/05-tela-inicial-erro.png',
            fullPage: true
        });

        // Validar título
        await expect(
            page.getByText('Gerenciamento de Pedidos')
        ).toBeVisible();

        // Pesquisar cliente inexistente
        await page.getByPlaceholder('🔍 Cliente')
            .fill('Carlos Souza');

        // Validar mensagem de erro
        await expect(
            page.getByText('Pedido não encontrado.')
        ).toBeVisible();

        // Evidência 6
        await page.screenshot({
            path: 'evidencias/06-pedido-nao-encontrado.png',
            fullPage: true
        });

        // Garantir que nenhum pedido está sendo exibido
        await expect(
            page.locator('text=Pedido #')
        ).toHaveCount(0);

    });

});