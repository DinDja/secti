import jsPDF from 'jspdf';

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper para formatar listas (arrays ou strings)
const formatList = (data) => {
  if (Array.isArray(data)) return data.join(', ');
  if (typeof data === 'string') return data;
  return '-';
};

export const generateProjectPDF = async (project) => {
  const doc = jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const bottomMargin = 25;

  try {
    //  CAPA 
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
    
    const capaLines = [
      `Instituição: ${project.instituicao || '-'}`,
      `Unidade Executora: ${project.unidade || '-'}`,
      `Responsável: ${project.responsavel || '-'}`,
      `Processo SEI: ${project.seiNaoSeAplica ? 'Não se aplica' : (project.numeroProcessoSEI || '-')}`,
      `Período de Execução: ${project.periodo || '-'}`
    ];

    capaLines.forEach(line => {
      infoY += 7;
      doc.text(line, pageWidth / 2, infoY, { align: 'center' });
    });

    doc.text('SALVADOR - BAHIA', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text(`${new Date().getFullYear()}`, pageWidth / 2, pageHeight - 22, { align: 'center' });

    //  PREPARAÇÃO DO CONTEÚDO 
    
    // Formatação de Instrumentos
    let instrumentosText = "Nenhum instrumento vinculado.";
    if (project.listaInstrumentos && project.listaInstrumentos.length > 0) {
        instrumentosText = project.listaInstrumentos.map((inst, idx) => {
            const tipo = inst.tipo === 'Outros' ? `Outros (${inst.outroTipo})` : inst.tipo;
            const status = inst.ativo ? "(Vigente)" : "(Inativo)";
            return `${idx + 1}. ${tipo} - Nº ${inst.numero || 'S/N'} - Vigência: ${inst.vigencia || '-'} ${status}`;
        }).join('\n');
    }

    // Formatação de Aditivos
    let aditivosText = "Nenhum aditivo registrado.";
    if (project.listaAditivos && project.listaAditivos.length > 0) {
        aditivosText = project.listaAditivos.map((ad, idx) => {
            return `${idx + 1}. SEI: ${ad.numeroSei || '-'} - Instrumento: ${ad.numeroInstrumento || '-'} - ${ad.descricao || ''}`;
        }).join('\n');
    }

    // Formatação de Localização Geográfica
    let localizacaoText = `Abrangência: ${project.localExecucao || '-'}\n`;
    if (project.localExecucao === 'Estado') {
        localizacaoText += `Estado: Bahia`;
    } else if (project.localExecucao === 'Território') {
        localizacaoText += `Territórios Contemplados:\n${formatList(project.territorio)}`;
    } else if (project.localExecucao === 'Município') {
        localizacaoText += `Municípios Contemplados:\n${formatList(project.municipio)}`;
    }

    const sectionsData = [
      { 
        id: 'sec1', 
        title: '1. DADOS CADASTRAIS E SITUAÇÃO', 
        content: `Status Atual: ${project.status || '-'}\n` +
                 `Parceiros Envolvidos: ${project.parceiros || '-'}\n\n` +
                 `INSTRUMENTOS VINCULADOS \n${instrumentosText}\n\n` +
                 `TERMOS ADITIVOS \n${aditivosText}`
      },
      { 
        id: 'sec2', 
        title: '2. CONTEXTUALIZAÇÃO', 
        content: `Caracterização do Contexto:\n${project.contexto || '-'}\n\n` +
                 `Problema ou Demanda:\n${project.problemaDemanda || '-'}\n\n` +
                 `Justificativa:\n${project.justificativa || '-'}`
      },
      { 
        id: 'sec3', 
        title: '3. FUNDAMENTAÇÃO LEGAL', 
        content: `${project.fundamentacaoLegal || '-'} \n${project.fundamentacaoLegalOutros || ''}`
      },
      { 
        id: 'sec4', 
        title: '4. OBJETIVOS E ABRANGÊNCIA', 
        content: `Objetivo Geral:\n${project.objetivoGeral || '-'}\n\n` +
                 `Objetivos Específicos:\n${project.objetivosEspecificos || '-'}\n\n` +
                 `Beneficiários: ${project.beneficiarios || '-'} (Estimativa: ${project.nmrBeneficiarios || 0})\n\n` +
                 ` LOCALIZAÇÃO GEOGRÁFICA \n${localizacaoText}`
      },
      { 
        id: 'sec5', 
        title: '5. RECURSOS E FINANCEIRO', 
        content: `Recursos Humanos:\n${project.recursosHumanos || '-'}\n\n` +
                 `Recursos Materiais:\n${project.recursosMateriais || '-'}\n\n` +
                 `Investimento Previsto: R$ ${project.investimentoReal || '-'}\n` +
                 `PAOE: ${project.paoe || '-'}\n` +
                 `Fontes de Financiamento: ${formatList(project.fonteFinanciamento)}`
      },
      { 
        id: 'sec6', 
        title: '6. EXECUÇÃO FÍSICA E FINANCEIRA', 
        content: `Meta Física:\n${project.metaFisica || '-'}\n\n` +
                 `Execução Física:\n${project.execucaoFisica || '-'}\n\n` +
                 `Execução Financeira:\n${project.execucaoFinanceira || '-'}`
      },
      { 
        id: 'sec7', 
        title: '7. ANÁLISE DE RISCOS E PENDÊNCIAS', 
        content: `Sustentabilidade:\n${project.sustentabilidade || '-'}\n\n` +
                 `Riscos e Mitigação:\n${project.riscos || '-'}\n\n` +
                 `Pendências:\n${project.pendencias || '-'}\n\n` +
                 `Observações Gerais:\n${project.observacoes || '-'}`
      }
    ];

    //  MONTAGEM DO PDF (PÁGINAS) 
    doc.addPage();
    const tocPageNumber = 2; 

    doc.addPage(); 
    let currentY = 30;
    const tocEntries = [];

    // Renderização das Seções de Texto
    sectionsData.forEach((section) => {
      tocEntries.push({ title: section.title, page: doc.internal.getNumberOfPages() });

      if (currentY + 15 > pageHeight - bottomMargin) {
        doc.addPage();
        currentY = 25;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(section.title, margin, currentY);
      currentY += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      
      const text = section.content;
      const splitText = doc.splitTextToSize(text, pageWidth - (margin * 2));
      
      splitText.forEach((line) => {
        if (currentY > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = 25;
          doc.setFont('helvetica', 'normal');
        }
        doc.text(line, margin, currentY);
        currentY += 6;
      });
      
      currentY += 10;
    });

    //  SEÇÃO 8: DOCUMENTOS ANEXOS 
    if (project.documentos && project.documentos.length > 0) {
      if (currentY + 30 > pageHeight - bottomMargin) {
        doc.addPage();
        currentY = 25;
      }

      tocEntries.push({ title: '8. DOCUMENTOS ANEXOS', page: doc.internal.getNumberOfPages() });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('8. DOCUMENTOS ANEXOS', margin, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Os seguintes documentos constam na base de dados do sistema:', margin, currentY);
      currentY += 10;

      // Cabeçalho da Lista
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('NOME DO ARQUIVO', margin + 2, currentY + 5.5);
      doc.text('TAMANHO', pageWidth - margin - 40, currentY + 5.5);
      doc.text('TIPO', pageWidth - margin - 15, currentY + 5.5, { align: 'right' });
      currentY += 10;

      // Lista de Arquivos
      project.documentos.forEach((docItem) => {
        if (currentY > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = 25;
        }

        const fileSize = formatBytes(docItem.tamanho);
        const fileExt = docItem.nome.split('.').pop().toUpperCase();
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);

        const nameText = docItem.nome;
        const nameWidth = pageWidth - (margin * 2) - 50; 
        const splitName = doc.splitTextToSize(nameText, nameWidth);

        doc.text(splitName, margin + 2, currentY);
        doc.text(fileSize, pageWidth - margin - 40, currentY);
        doc.text(fileExt, pageWidth - margin - 15, currentY, { align: 'right' });

        currentY += (splitName.length * 5) + 4; 
        
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
      });
      
      currentY += 10;
    }

    //  SEÇÃO 9: REGISTRO FOTOGRÁFICO 
    if (project.fotos && project.fotos.length > 0) {
      doc.addPage();
      currentY = 25;
      
      tocEntries.push({ title: '9. REGISTRO FOTOGRÁFICO', page: doc.internal.getNumberOfPages() });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('9. REGISTRO FOTOGRÁFICO', margin, currentY);
      currentY += 15;

      const maxImageHeight = 100;
      const maxImageWidth = pageWidth - (margin * 2);

      for (let i = 0; i < project.fotos.length; i++) {
        const imgData = project.fotos[i];
        
        if (currentY + maxImageHeight > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = 25;
        }

        try {
          // Adiciona imagem (assumindo base64 ou URL acessível)
          doc.addImage(imgData, 'JPEG', margin, currentY, maxImageWidth, maxImageHeight, undefined, 'FAST');
          
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`Registro Fotográfico ${i + 1}`, margin, currentY + maxImageHeight + 5);
          
          currentY += maxImageHeight + 15;
        } catch (err) {
          console.error("Erro ao renderizar foto no PDF", err);
        }
      }
    }

    //  SUMÁRIO (GERADO POR ÚLTIMO PARA PEGAR Nº PÁGINAS) 
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
      doc.link(margin, tocY - 5, pageWidth - (margin * 2), 7, { pageNumber: entry.page });

      tocY += 10;
    });

    //  RODAPÉ EM TODAS AS PÁGINAS (MENOS CAPA) 
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`${i}`, pageWidth - margin - 5, pageHeight - 10);
      doc.text(`SECTI.OS - ${project.titulo?.substring(0, 30) || 'Projeto'}...`, margin, pageHeight - 10);
    }

    const fileName = project.titulo ? project.titulo.replace(/\s+/g, '_').toLowerCase() : 'projeto';
    doc.save(`PROJETO_SECTI_${fileName}.pdf`);

  } catch (error) {
    console.error("Erro fatal ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Verifique o console.");
  }
};