# Sistema de Manutenção de Veículos com QR Code

Uma aplicação Next.js moderna para gerenciar o histórico de manutenções de veículos usando QR codes personalizados.

## Funcionalidades

- ✅ **Cadastro de Manutenções**: Registre todas as manutenções realizadas no veículo
  - Data da manutenção
  - Peça utilizada
  - Quem fez a manutenção (mecânico/oficina)
  - Onde foi feita (localização)
  - Quilometragem (opcional)
  - Custo (opcional)
  - Descrição adicional (opcional)
- ✅ **Geração de QR Code Personalizado**: Gere QR codes contendo todo o histórico de manutenções em formato estruturado
- ✅ **Leitura de QR Code**: Use a câmera do dispositivo para ler QR codes e visualizar o histórico completo
- ✅ **Histórico Visual**: Visualize todas as manutenções de forma organizada e cronológica
- ✅ **Download**: Baixe os QR codes gerados como imagens PNG
- ✅ **Interface Moderna**: Design responsivo e suporte a tema escuro
- ✅ **Múltiplas Manutenções**: Adicione quantas manutenções quiser ao mesmo QR code

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- qrcode (biblioteca para geração)
- html5-qrcode (biblioteca para leitura)

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador

## Uso

### Cadastrar Manutenções e Gerar QR Code

1. Clique na aba "Cadastrar & Gerar QR Code"
2. Preencha o formulário com os dados da manutenção:
   - **Data da Manutenção**: Data em que foi realizada
   - **Peça Utilizada**: Nome da peça ou componente trocado/reparado
   - **Quem Fez**: Nome do mecânico ou oficina
   - **Onde Foi Feita**: Endereço ou localização
   - **Quilometragem**: (Opcional) Quilometragem do veículo
   - **Custo**: (Opcional) Valor gasto na manutenção
   - **Descrição**: (Opcional) Observações adicionais
3. Clique em "Adicionar Manutenção"
4. Repita o processo para adicionar mais manutenções
5. O QR code será gerado automaticamente com todas as manutenções
6. Ajuste o tamanho do QR code se necessário
7. Clique em "Download QR Code" para salvar a imagem
8. Você pode remover manutenções clicando no "✕" em cada item

### Ler QR Code de Manutenções

1. Clique na aba "Ler QR Code"
2. Clique em "Iniciar Leitura"
3. Permita o acesso à câmera quando solicitado
4. Aponte a câmera para o QR code
5. O histórico completo de manutenções será exibido automaticamente
6. Visualize todas as informações de forma organizada
7. Use o botão "Copiar Dados" para copiar todas as informações em formato JSON

## Estrutura de Dados

O QR code armazena os dados em formato JSON com a seguinte estrutura:

```json
{
  "maintenances": [
    {
      "id": "string",
      "date": "YYYY-MM-DD",
      "part": "string",
      "mechanic": "string",
      "location": "string",
      "description": "string (opcional)",
      "mileage": "number (opcional)",
      "cost": "number (opcional)"
    }
  ],
  "createdAt": "ISO date string",
  "lastUpdated": "ISO date string"
}
```

## Notas

- A leitura de QR code requer acesso à câmera do dispositivo
- Funciona melhor em dispositivos com câmera traseira (mobile)
- Certifique-se de ter permissões de câmera habilitadas no navegador
- O QR code pode armazenar múltiplas manutenções, mas tenha cuidado com o tamanho - muitos dados podem tornar o QR code difícil de ler
- Os dados são armazenados apenas no QR code - não há banco de dados, então mantenha o QR code seguro

## Build para Produção

```bash
npm run build
npm start
```

