// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  try {
    // --- 1. CAPA (Página 1) ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('GOVERNO DO ESTADO DA BAHIA', pageWidth / 2, 25, { align: 'center' });
    doc.text('SECRETARIA DE CIÊNCIA, TECNOLOGIA E INOVAÇÃO', pageWidth / 2, 32, { align: 'center' });

    try {
      const logo = await loadImage('/img/sectiLogo.jpg');
      const logoWidth = 40;
      const logoHeight = (logo.height * logoWidth) / logo.width;
      doc.addImage(logo, 'JPEG', (pageWidth - logoWidth) / 2, 45, logoWidth, logoHeight);
    } catch (e) {
      console.warn("Logo não encontrada.");
    }

    doc.setFontSize(16);
    const title = project.titulo?.toUpperCase() || 'PROJETO SEM TÍTULO';
    doc.text(doc.splitTextToSize(title, pageWidth - 60), pageWidth / 2, 110, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Natureza: ${project.natureza?.toUpperCase() || 'PROJETO'}`, pageWidth / 2, 140, { align: 'center' });
    
    let infoY = 160;
    doc.setFont('helvetica', 'bold');
    doc.text('IDENTIFICAÇÃO TÉCNICA', pageWidth / 2, infoY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    [
      `Instituição: ${project.instituicao || '-'}`,
      `Unidade: ${project.unidade || '-'}`,
      `Responsável: ${project.responsavel || '-'}`,
      `Período: ${project.periodo || '-'}`
    ].forEach(line => {
      infoY += 7;
      doc.text(line, pageWidth / 2, infoY, { align: 'center' });
    });

    doc.text('SALVADOR - BAHIA', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text(`${new Date().getFullYear()}`, pageWidth / 2, pageHeight - 22, { align: 'center' });

    // --- 2. RESERVA DE PÁGINA PARA O SUMÁRIO (Página 2) ---
    doc.addPage();
    const tocPageNumber = 2;

    // --- 3. CONTEÚDO (Inicia na Página 3) ---
    doc.addPage();
    let currentY = 30;
    const sectionsData = [
      { id: 'sec1', title: '1. CONTEXTUALIZAÇÃO', content: project.contexto },
      { id: 'sec2', title: '2. PROBLEMA OU DEMANDA', content: project.problemaDemanda },
      { id: 'sec3', title: '3. JUSTIFICATIVA', content: project.justificativa },
      { id: 'sec4', title: '4. OBJETIVO GERAL', content: project.objetivoGeral },
      { id: 'sec5', title: '5. OBJETIVOS ESPECÍFICOS', content: project.objetivosEspecificos },
      { id: 'sec6', title: '6. PÚBLICO-ALVO', content: project.publicoAlvo },
      { id: 'sec7', title: '7. METODOLOGIA E ESTRATÉGIA', content: project.descricaoAcoes },
      { id: 'sec8', title: '8. RECURSOS NECESSÁRIOS', content: project.recursosHumanos },
      { id: 'sec9', title: '9. RESULTADOS ESPERADOS', content: project.resultadosEsperados },
      { id: 'sec10', title: '10. REFERÊNCIAS', content: project.referencias }
    ];

    const tocEntries = [];

    sectionsData.forEach((section) => {
      // Registrar posição para o sumário
      tocEntries.push({
        title: section.title,
        page: doc.internal.getNumberOfPages()
      });

      if (currentY > 250) {
        doc.addPage();
        currentY = 25;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(section.title, margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const text = section.content || 'Informação não registrada pelo proponente.';
      const splitText = doc.splitTextToSize(text, pageWidth - (margin * 2));
      doc.text(splitText, margin, currentY);
      
      currentY += (splitText.length * 6) + 15;
    });

    // --- 4. PREENCHIMENTO DO SUMÁRIO (Voltando para Página 2) ---
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
      
      // Linha pontilhada (estética ABNT)
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

      // ANCORA CLICÁVEL: Torna a linha do sumário um link para a página
      doc.link(margin, tocY - 5, pageWidth - (margin * 2), 7, { pageNumber: entry.page });

      tocY += 10;
    });

    // --- 5. PAGINAÇÃO (Rodapé em todas as páginas exceto capa) ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`${i}`, pageWidth - margin - 5, pageHeight - 10);
      doc.text(`SECTI.OS - ${project.titulo?.substring(0, 20)}`, margin, pageHeight - 10);
    }

    const fileName = project.titulo ? project.titulo.replace(/\s+/g, '_').toLowerCase() : 'projeto';
    doc.save(`PROJETO_SECTI_${fileName}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar PDF com Sumário:", error);
  }
};