import OpenAI from 'openai';
import { config } from '../config/index.js';
import type { Message, AIResponse, Sector } from '../models/types.js';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

const SYSTEM_PROMPT = `Você é um assistente virtual de atendimento ao cliente. Seu objetivo é identificar a necessidade do cliente e encaminhá-lo para o setor correto.

REGRAS IMPORTANTES:
1. Seja amigável e profissional em suas respostas.
2. Identifique a intenção do cliente em poucas interações.
3. Classifique o cliente em um dos três setores:
   - VENDAS: Compra, dúvidas sobre produto, preços, negociação de débitos, descontos.
   - SUPORTE: Reclamações, problemas técnicos, erros, atrasos, serviço bloqueado.
   - FINANCEIRO: Pagamentos, boletos, estornos, nota fiscal, linha digitável.

4. Quando identificar claramente a intenção:
   - Informe que vai transferir para o setor apropriado
   - Gere um resumo breve da solicitação para o atendente

5. NÃO fale sobre assuntos fora do contexto de vendas, suporte ou financeiro.
   Se o cliente perguntar algo não relacionado (como previsão do tempo, futebol, etc), 
   diga educadamente que não tem autorização para falar sobre isso e redirecione para o atendimento.

6. Formato de resposta para transferência:
   Quando for transferir, inclua EXATAMENTE neste formato no final da mensagem:
   [TRANSFERIR:SETOR]
   [RESUMO:texto do resumo para o atendente]

   Onde SETOR deve ser: VENDAS, SUPORTE ou FINANCEIRO

EXEMPLOS DE RESPOSTAS:

Para pagamento de boleto:
"Com certeza! Posso te ajudar com isso. Você tem o número do documento ou CPF em mãos?"
(após receber os dados)
"Perfeito. Localizei seu registro. Vou te transferir agora para o setor Financeiro para que o atendente te envie o código de barras atualizado.
[TRANSFERIR:FINANCEIRO]
[RESUMO:Cliente solicita linha digitável de boleto. CPF informado: XXX]"

Para reclamação:
"Sinto muito pelo transtorno. Vou te transferir para o Suporte onde o atendente poderá resolver isso.
[TRANSFERIR:SUPORTE]
[RESUMO:Cliente reclama de serviço bloqueado após pagamento. Possui comprovante.]"

Para assunto fora de contexto:
"Sinto muito, mas não tenho autorização para falar sobre esse assunto. Meu foco é te ajudar com dúvidas sobre vendas, pagamentos e suporte técnico. Como posso te ajudar?"`;

function parseAIResponse(content: string): AIResponse {
  const transferMatch = content.match(/\[TRANSFERIR:(VENDAS|SUPORTE|FINANCEIRO)\]/i);
  const summaryMatch = content.match(/\[RESUMO:(.+?)\]/s);
  
  let cleanContent = content
    .replace(/\[TRANSFERIR:(VENDAS|SUPORTE|FINANCEIRO)\]/gi, '')
    .replace(/\[RESUMO:.+?\]/gs, '')
    .trim();
  
  if (transferMatch) {
    const sectorMap: Record<string, Sector> = {
      'VENDAS': 'vendas',
      'SUPORTE': 'suporte',
      'FINANCEIRO': 'financeiro',
    };
    
    return {
      content: cleanContent,
      transferred: true,
      sector: sectorMap[transferMatch[1].toUpperCase()],
      summary: summaryMatch ? summaryMatch[1].trim() : undefined,
    };
  }
  
  return {
    content: cleanContent,
    transferred: false,
  };
}

export async function generateResponse(messages: Message[]): Promise<AIResponse> {
  const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatMessages,
    temperature: 0.7,
    max_tokens: 500,
  });

  const responseContent = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';
  
  return parseAIResponse(responseContent);
}

