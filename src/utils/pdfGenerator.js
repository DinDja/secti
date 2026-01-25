import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; // Mantenha se for usar tabelas no futuro, mas não é estritamente necessário agora

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export const generateProjectPDF = async (project) => {
  const doc = jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const bottomMargin = 25;

  try {
    // --- CAPA ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('GOVERNO DO ESTADO DA BAHIA', pageWidth / 2, 25, { align: 'center' });
    doc.text('SECRETARIA DE CIÊNCIA, TECNOLOGIA E INOVAÇÃO', pageWidth / 2, 32, { align: 'center' });

    try {
      // Certifique-se que este caminho existe ou remova o try/catch se não tiver logo local
      const logo = await loadImage('/img/sectiLogo.jpg');
      const logoWidth = 40;
      const logoHeight = (logo.height * logoWidth) / logo.width;
      doc.addImage(logo, 'JPEG', (pageWidth - logoWidth) / 2, 45, logoWidth, logoHeight);
    } catch (e) {
      console.warn("Logo não encontrada (pulei essa etapa).");
    }

    doc.setFontSize(16);
    const title = project.titulo?.toUpperCase() || 'PROJETO SEM TÍTULO';
    doc.text(doc.splitTextToSize(title, pageWidth - 60), pageWidth / 2, 110, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Natureza: ${project.natureza?.toUpperCase() || 'PROJETO'}`, pageWidth / 2, 140, { align: 'center' });
    
    // Identificação Técnica na Capa
    let infoY = 160;
    doc.setFont('helvetica', 'bold');
    doc.text('IDENTIFICAÇÃO TÉCNICA', pageWidth / 2, infoY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const capaLines = [
      `Instituição: ${project.instituicao || '-'}`,
      `Unidade Executora: ${project.unidade || '-'}`,
      `Responsável: ${project.responsavel || '-'}`,
      `Processo SEI: ${project.numeroProcessoSEI || '-'}`,
      `Período: ${project.periodo || '-'}`
    ];

    capaLines.forEach(line => {
      infoY += 7;
      doc.text(line, pageWidth / 2, infoY, { align: 'center' });
    });

    doc.text('SALVADOR - BAHIA', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text(`${new Date().getFullYear()}`, pageWidth / 2, pageHeight - 22, { align: 'center' });

    // --- FIM DA CAPA ---

    // Preparação para Sumário e Conteúdo
    doc.addPage();
    const tocPageNumber = 2; // Guardamos a página 2 para o sumário depois

    doc.addPage(); // Começamos o conteúdo na página 3
    let currentY = 30;

    // --- MAPEAMENTO DOS DADOS DO EDITOR PARA SEÇÕES DO PDF ---
    // Agrupei os campos do Editor em seções lógicas de leitura
    const sectionsData = [
      { 
        id: 'sec1', 
        title: '1. DADOS DO INSTRUMENTO', 
        content: `Status: ${project.status || '-'}\n` +
                 `Tipo de Instrumento: ${project.tipoInstrumento || '-'} ${project.instrumentoOutros ? `(${project.instrumentoOutros})` : ''}\n` +
                 `Número: ${project.numeroInstrumento || '-'} | Vigência: ${project.vigenciaInstrumento || '-'}\n` +
                 `Ativo: ${project.instrumentoAtivo ? 'SIM' : 'NÃO'}\n` +
                 `Parceiros: ${project.parceiros || '-'}`
      },
      { 
        id: 'sec2', 
        title: '2. CONTEXTUALIZAÇÃO E JUSTIFICATIVA', 
        content: `Contexto:\n${project.contexto || '-'}\n\n` +
                 `Problema/Demanda:\n${project.problemaDemanda || '-'}\n\n` +
                 `Evidências:\n${project.evidencias || '-'}\n\n` +
                 `Justificativa:\n${project.justificativa || '-'}`
      },
      { 
        id: 'sec3', 
        title: '3. FUNDAMENTAÇÃO LEGAL', 
        content: `${project.fundamentacaoLegal || '-'} \n${project.fundamentacaoLegalOutros || ''}`
      },
      { 
        id: 'sec4', 
        title: '4. OBJETIVOS E PÚBLICO', 
        content: `Objetivo Geral:\n${project.objetivoGeral || '-'}\n\n` +
                 `Objetivos Específicos:\n${project.objetivosEspecificos || '-'}\n\n` +
                 `Beneficiários: ${project.beneficiarios || '-'} (Qtd: ${project.nmrBeneficiarios || 0})\n` +
                 `Perfil do Público: ${project.perfilPublico || '-'}\n` +
                 `Local de Execução: ${project.localExecucao || '-'}\n` +
                 `Território: ${project.territorio || '-'} | Município: ${project.municipio || '-'}`
      },
      { 
        id: 'sec5', 
        title: '5. RECURSOS E FINANCEIRO', 
        content: `Recursos Humanos:\n${project.recursosHumanos || '-'}\n\n` +
                 `Recursos Materiais:\n${project.recursosMateriais || '-'}\n\n` +
                 `Investimento Previsto: R$ ${project.investimentoReal || '-'}\n` +
                 `PAOE: ${project.paoe || '-'} | Fonte: ${project.fonteFinanciamento || '-'}\n\n` +
                 `Descrição Financeira:\n${project.recursosFinanceiros || '-'}`
      },
      { 
        id: 'sec6', 
        title: '6. EXECUÇÃO E METAS', 
        content: `Meta Física:\n${project.metaFisica || '-'}\n\n` +
                 `Execução Física:\n${project.execucaoFisica || '-'}\n\n` +
                 `Execução Financeira:\n${project.execucaoFinanceira || '-'}`
      },
      { 
        id: 'sec7', 
        title: '7. ANÁLISE E PENDÊNCIAS', 
        content: `Sustentabilidade:\n${project.sustentabilidade || '-'}\n\n` +
                 `Riscos e Mitigação:\n${project.riscos || '-'}\n\n` +
                 `Pendências:\n${project.pendencias || '-'}\n\n` +
                 `Observações Gerais:\n${project.observacoes || '-'}`
      }
    ];

    const tocEntries = [];

    // --- LOOP DE TEXTO ---
    sectionsData.forEach((section) => {
      tocEntries.push({
        title: section.title,
        page: doc.internal.getNumberOfPages()
      });

      // Verifica quebra de página antes do título
      if (currentY + 15 > pageHeight - bottomMargin) {
        doc.addPage();
        currentY = 25;
      }

      // Título da Seção
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(section.title, margin, currentY);
      currentY += 10;

      // Conteúdo
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      
      const text = section.content;
      const splitText = doc.splitTextToSize(text, pageWidth - (margin * 2));
      
      splitText.forEach((line) => {
        if (currentY > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = 25;
          // Repete config de fonte ao mudar página
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
        }
        doc.text(line, margin, currentY);
        currentY += 6;
      });
      
      currentY += 10; // Espaço após cada seção
    });

    // --- LÓGICA DAS FOTOGRAFIAS (NOVIDADE) ---
    if (project.fotos && project.fotos.length > 0) {
      doc.addPage();
      currentY = 25;
      
      // Adiciona ao sumário
      tocEntries.push({
        title: '8. REGISTRO FOTOGRÁFICO',
        page: doc.internal.getNumberOfPages()
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('8. REGISTRO FOTOGRÁFICO', margin, currentY);
      currentY += 15;

      const maxImageHeight = 100; // Altura máxima por foto
      const maxImageWidth = pageWidth - (margin * 2);

      for (let i = 0; i < project.fotos.length; i++) {
        const imgData = project.fotos[i];
        
        // Verifica espaço na página (Header + Imagem + Margin)
        if (currentY + maxImageHeight > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = 25;
        }

        try {
          // As imagens vêm do editor como base64, jsPDF aceita direto
          // Ajuste de proporção simples (mantendo aspect ratio do container do editor aprox)
          doc.addImage(imgData, 'JPEG', margin, currentY, maxImageWidth, maxImageHeight, undefined, 'FAST');
          
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`Foto ${i + 1}`, margin, currentY + maxImageHeight + 5);
          
          currentY += maxImageHeight + 15; // Espaço para a próxima
        } catch (err) {
          console.error("Erro ao renderizar imagem no PDF", err);
        }
      }
    }

    // --- GERAÇÃO DO SUMÁRIO (Voltando à página 2) ---
    doc.setPage(tocPageNumber);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('SUMÁRIO', pageWidth / 2, 30, { align: 'center' });

    let tocY = 50;
    doc.setFontSize(11);
    
    tocEntries.forEach((entry) => {
      doc.setFont('helvetica', 'bold');
      doc.text(entry.title, margin, tocY);
      
      doc.setFont('helvetica', 'normal');
      const titleWidth = doc.getTextWidth(entry.title);
      const pageStr = entry.page.toString();
      const pageWidthAtEnd = pageWidth - margin - 5;
      
      let dots = "";
      const dotWidth = doc.getTextWidth(".");
      const availableSpace = pageWidthAtEnd - margin - titleWidth - doc.getTextWidth(pageStr) - 10;
      for(let i=0; i < Math.floor(availableSpace/dotWidth); i++) dots += ".";
      
      doc.text(dots, margin + titleWidth + 2, tocY);
      doc.text(pageStr, pageWidth - margin, tocY, { align: 'right' });

      // Link clicável no PDF
      doc.link(margin, tocY - 5, pageWidth - (margin * 2), 7, { pageNumber: entry.page });

      tocY += 10;
    });

    // --- RODAPÉ EM TODAS AS PÁGINAS ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`${i}`, pageWidth - margin - 5, pageHeight - 10);
      doc.text(`SECTI.OS - ${project.titulo?.substring(0, 30)}...`, margin, pageHeight - 10);
    }

    const fileName = project.titulo ? project.titulo.replace(/\s+/g, '_').toLowerCase() : 'projeto';
    doc.save(`PROJETO_SECTI_${fileName}.pdf`);

  } catch (error) {
    console.error("Erro fatal ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Verifique o console.");
  }
};