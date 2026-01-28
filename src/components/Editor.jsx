import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Info, AlertCircle,
  BookOpen, CheckCircle2, Save, Send, X,
  Target, Users2, MapPin, Cpu, ClipboardList,
  Calendar, DollarSign, TrendingUp, BarChart3,
  RotateCcw, ShieldAlert, Lock, Camera, Trash2, Plus, FileText, FilePlus, Download
} from 'lucide-react';
import HudBorder from './HudBorder';
import SectiLogo from './SectiLogo';
import DeckNavigation from './DeckNavigation';
import RenderInput from './RenderInput';
import RenderSelect from './RenderSelect';
import { DECKS } from '../utils/decks';
import { HELP_TEXT } from '../utils/helpText';

const UNIDADES_EXECUTORAS = [
  { value: 'DIRETORIA DE POLÍTICAS E PROGRAMAS PARA O DESENVOLVIMENTO TERRITORIAL - DPPDT', label: 'DIRETORIA DE POLÍTICAS E PROGRAMAS PARA O DESENVOLVIMENTO TERRITORIAL - DPPDT' },
  { value: 'DIRETORIA DE POPULARIZAÇÃO DE CT&I - DPP', label: 'DIRETORIA DE POPULARIZAÇÃO DE CT&I - DPP' },
  { value: 'DIRETORIA DE INDUÇÃO PARA O DESENVOLVIMENTO CIENTÍFICO - DIDEC', label: 'DIRETORIA DE INDUÇÃO PARA O DESENVOLVIMENTO CIENTÍFICO - DIDEC' },
  { value: 'DIRETORIA DE INOVAÇÃO E INCLUSÃO - DII', label: 'DIRETORIA DE INOVAÇÃO E INCLUSÃO - DII' },
  { value: 'DIRETORIA DE INOVAÇÃO E PRODUTIVIDADE - DIP', label: 'DIRETORIA DE INOVAÇÃO E PRODUTIVIDADE - DIP' },
  { value: 'DIRETORIA DE INOVAÇÃO E COMPETITIVIDADE - DIC', label: 'DIRETORIA DE INOVAÇÃO E COMPETITIVIDADE - DIC' },
  { value: 'DIRETORIA DE TECNOLOGIA E CONECTIVIDADE - DTC', label: 'DIRETORIA DE TECNOLOGIA E CONECTIVIDADE - DTC' },
  { value: 'DIRETORIA DE PARQUES TECNOLÓGICOS E AMBIENTES DE INOVAÇÃO - DPTAI', label: 'DIRETORIA DE PARQUES TECNOLÓGICOS E AMBIENTES DE INOVAÇÃO - DPTAI' }
];

const RESPONSAVEIS = [
  { value: 'Escolha um responsável', label: 'Escolha um responsável' },
  { value: 'Carolina de Azeredo Amaro', label: 'Carolina de Azeredo Amaro' },
  { value: 'Elisângela dos Reis Oliveira', label: 'Elisângela dos Reis Oliveira' },
  { value: 'Georgheton Melo Nogueira', label: 'Georgheton Melo Nogueira' },
  { value: 'Sahada Josephina Luedy Mendes Palmeira', label: 'Sahada Josephina Luedy Mendes Palmeira' },
  { value: 'Mariana Brasil Nogueira Lima', label: 'Mariana Brasil Nogueira Lima' },
  { value: 'Sócrates Gomes Pereira Bittencourt Santana', label: 'Sócrates Gomes Pereira Bittencourt Santana' },
  { value: 'Diana Sampaio Melo', label: 'Diana Sampaio Melo' },
  { value: 'João dos Santos Santana Júnior', label: 'João dos Santos Santana Júnior' }
];

const INSTRUMENTOS_OPTIONS = [
  { value: 'Convênio', label: 'Convênio' },
  { value: 'Contrato', label: 'Contrato' },
  { value: 'Acordo de Cooperação Técnica', label: 'Acordo de Cooperação Técnica' },
  { value: 'Outros', label: 'Outros' }
];

const STATUS_OPTIONS = [
  { value: 'Em fase de planejamento', label: 'Em fase de planejamento' },
  { value: 'Em desenvolvimento', label: 'Em desenvolvimento' },
  { value: 'Em andamento', label: 'Em andamento' },
  { value: 'Em revisão', label: 'Em revisão' },
  { value: 'Paralizado', label: 'Paralizado' }
];

const FUNDAMENTACAO_LEGAL_OPTIONS = [
  { value: 'Lei Nº 14.901 DE 19 DE MAIO DE 2025 - Programa de Promoção, Popularização e Difusão da Ciência, Tecnologia e Inovação - Programa PopCiência Bahia', label: 'Lei Nº 14.901/2025 - Programa PopCiência Bahia' },
  { value: 'Decreto nº 23.706 de 19 de Maio de 2025 - Projeto de Educação Científica e Promoção da Ciência para as Juventudes da Bahia - Projeto PopCiência Jovem', label: 'Decreto nº 23.706/2025 - Projeto PopCiência Jovem' },
  { value: 'Decreto nº 22.327 de 16 de Outubro de 2023 - Regulamenta a Lei 14.315 – Marco Legal da Ciência, Tecnologia e Inovação', label: 'Decreto nº 22.327/2023 - Marco Legal da CT&I' },
  { value: 'Lei Nº 14.315 de 14 de maio de 2021 - Marco Legal da Ciência, Tecnologia e Inovação do Estado da Bahia', label: 'Lei Nº 14.315/2021 - Marco Legal da CT&I' },
  { value: 'Lei Nº 10.966 de 16 de abril de 2008 - Dispõe sobre incentivos à inovação e à pesquisa científica e tecnológica no ambiente produtivo', label: 'Lei Nº 10.966/2008 - Lei de Inovação da Bahia' },
  { value: 'Lei Federal nº 13.243 de 11 de janeiro de 2016 - Marco Legal da Ciência, Tecnologia e Inovação no Brasil', label: 'Lei Federal nº 13.243/2016 - Marco Legal CT&I Brasil' },
  { value: 'Outro(s)', label: 'Outro(s)' }
];

const FONTES_FINANCIAMENTO = [
  { value: 'Tesouro', label: 'Tesouro' },
  { value: 'Emenda Estadual', label: 'Emenda Estadual' },
  { value: 'Emenda Federal', label: 'Emenda Federal' },
  { value: 'Convênio Federal', label: 'Convênio Federal' },
  { value: 'Outra', label: 'Outra' }
];

const TIPO_LOCALIZACAO_OPTIONS = [
  { value: 'Estado', label: 'Estado' },
  { value: 'Território', label: 'Território' },
  { value: 'Município', label: 'Município' }
];

const TERRITORIOS_BAHIA = [
  { value: 'Irecê', label: 'Irecê' },
  { value: 'Velho Chico', label: 'Velho Chico' },
  { value: 'Chapada Diamantina', label: 'Chapada Diamantina' },
  { value: 'Sisal', label: 'Sisal' },
  { value: 'Litoral Sul', label: 'Litoral Sul' },
  { value: 'Baixo Sul', label: 'Baixo Sul' },
  { value: 'Extremo Sul', label: 'Extremo Sul' },
  { value: 'Médio Sudoeste da Bahia', label: 'Médio Sudoeste da Bahia' },
  { value: 'Vale do Jiquiriçá', label: 'Vale do Jiquiriçá' },
  { value: 'Sertão do São Francisco', label: 'Sertão do São Francisco' },
  { value: 'Bacia do Rio Grande', label: 'Bacia do Rio Grande' },
  { value: 'Bacia do Paramirim', label: 'Bacia do Paramirim' },
  { value: 'Sertão Produtivo', label: 'Sertão Produtivo' },
  { value: 'Piemonte do Paraguaçu', label: 'Piemonte do Paraguaçu' },
  { value: 'Piemonte da Diamantina', label: 'Piemonte da Diamantina' },
  { value: 'Piemonte Norte do Itapicuru', label: 'Piemonte Norte do Itapicuru' },
  { value: 'Portal do Sertão', label: 'Portal do Sertão' },
  { value: 'Litoral Norte e Agreste Baiano', label: 'Litoral Norte e Agreste Baiano' },
  { value: 'Vitória da Conquista', label: 'Vitória da Conquista' },
  { value: 'Costa do Descobrimento', label: 'Costa do Descobrimento' },
  { value: 'Médio Rio de Contas', label: 'Médio Rio de Contas' },
  { value: 'Bacia do Jacuípe', label: 'Bacia do Jacuípe' },
  { value: 'Vale do Rio de Contas', label: 'Vale do Rio de Contas' },
  { value: 'Recôncavo', label: 'Recôncavo' },
  { value: 'Rio Corrente', label: 'Rio Corrente' },
  { value: 'Itaparica', label: 'Itaparica' },
  { value: 'Metropolitano de Salvador', label: 'Metropolitano de Salvador' }
];

const MUNICIPIOS_BAHIA = [
  "Abaíra", "Abaré", "Acajutiba", "Adustina", "Água Fria", "Aiquara", "Alagoinhas", "Alcobaça", "Almadina", "Amargosa", "Amélia Rodrigues", "América Dourada", "Anagé", "Andaraí", "Andorinha", "Angical", "Anguera", "Antas", "Antônio Cardoso", "Antônio Gonçalves", "Aporá", "Apuarema", "Araçás", "Aracatu", "Araci", "Aramari", "Arataca", "Aratuípe", "Aurelino Leal", "Baianópolis", "Baixa Grande", "Banzaê", "Barra", "Barra da Estiva", "Barra do Choça", "Barra do Mendes", "Barra do Rocha", "Barreiras", "Barro Alto", "Barro Preto", "Barrocas", "Belmonte", "Belo Campo", "Biritinga", "Boa Nova", "Boa Vista do Tupim", "Bom Jesus da Lapa", "Bom Jesus da Serra", "Boninal", "Bonito", "Boquira", "Botuporã", "Brejões", "Brejolândia", "Brotas de Macaúbas", "Brumado", "Buerarema", "Buritirama", "Caatiba", "Cabaceiras do Paraguaçu", "Cachoeira", "Caculé", "Caém", "Caetanos", "Caetité", "Cafarnaum", "Cairu", "Caldeirão Grande", "Camacan", "Camaçari", "Camamu", "Campo Alegre de Lourdes", "Campo Formoso", "Canápolis", "Canarana", "Canavieiras", "Candeal", "Candeias", "Candiba", "Cândido Sales", "Cansanção", "Canudos", "Capela do Alto Alegre", "Capim Grosso", "Caraíbas", "Caravelas", "Cardeal da Silva", "Carinhanha", "Casa Nova", "Castro Alves", "Catolândia", "Catu", "Caturama", "Central", "Chorrochó", "Cícero Dantas", "Cipó", "Coaraci", "Cocos", "Conceição da Feira", "Conceição do Almeida", "Conceição do Coité", "Conceição do Jacuípe", "Conde", "Condeúba", "Contendas do Sincorá", "Coração de Maria", "Cordeiros", "Coribe", "Coronel João Sá", "Correntina", "Cotegipe", "Cravolândia", "Crisópolis", "Cristópolis", "Cruz das Almas", "Curaçá", "Dário Meira", "Dias d'Ávila", "Dom Basílio", "Dom Macedo Costa", "Elísio Medrado", "Encruzilhada", "Entre Rios", "Érico Cardoso", "Esplanada", "Euclides da Cunha", "Eunápolis", "Fátima", "Feira da Mata", "Feira de Santana", "Filadélfia", "Firmino Alves", "Floresta Azul", "Formosa do Rio Preto", "Gandu", "Gavião", "Gentio do Ouro", "Glória", "Gongogi", "Governador Mangabeira", "Guajeru", "Guanambi", "Guaratinga", "Heliópolis", "Iaçu", "Ibiassucê", "Ibicaraí", "Ibicoara", "Ibicuí", "Ibipeba", "Ibipitanga", "Ibiquera", "Ibirapitanga", "Ibirapuã", "Ibirataia", "Ibitiara", "Ibititá", "Ibotirama", "Ichu", "Igaporã", "Igrapiúna", "Iguaí", "Ilhéus", "Inhambupe", "Ipecaetá", "Ipiaú", "Ipirá", "Ipupiara", "Irajuba", "Iramaia", "Iraquara", "Irará", "Irecê", "Itabela", "Itaberaba", "Itabuna", "Itacaré", "Itaeté", "Itagi", "Itagibá", "Itagimirim", "Itaguaçu da Bahia", "Itaju do Colônia", "Itajuípe", "Itamaraju", "Itamari", "Itambé", "Itanagra", "Itanhém", "Itaparica", "Itapé", "Itapebi", "Itapetinga", "Itapicuru", "Itapitanga", "Itaquara", "Itarantim", "Itatim", "Itiruçu", "Itiúba", "Itororó", "Ituaçu", "Ituberá", "Iuiú", "Jaborandi", "Jacaraci", "Jacobina", "Jaguaquara", "Jaguarari", "Jaguaripe", "Jandaíra", "Jequié", "Jeremoabo", "Jiquiriçá", "Jitaúna", "João Dourado", "Juazeiro", "Jucuruçu", "Jussara", "Jussiape", "Lafaiete Coutinho", "Lagoa Real", "Laje", "Lajedão", "Lajedinho", "Lajedo do Tabocal", "Lamarão", "Lapão", "Lauro de Freitas", "Lençóis", "Licínio de Almeida", "Livramento de Nossa Senhora", "Luís Eduardo Magalhães", "Macajuba", "Macarani", "Macaúbas", "Macururé", "Madre de Deus", "Maetinga", "Maiquinique", "Mairi", "Malhada", "Malhada de Pedras", "Manoel Vitorino", "Mansidão", "Maracás", "Maragogipe", "Maraú", "Marcionílio Souza", "Mascote", "Mata de São João", "Matina", "Medeiros Neto", "Miguel Calmon", "Milagres", "Mirangaba", "Mirante", "Monte Santo", "Morpará", "Morro do Chapéu", "Mortugaba", "Mucugê", "Mucuri", "Mulungu do Morro", "Mundo Novo", "Muniz Ferreira", "Muquém de São Francisco", "Muritiba", "Mutuípe", "Nazaré", "Nilo Peçanha", "Nordestina", "Nova Canaã", "Nova Fátima", "Nova Ibiá", "Nova Itarana", "Nova Redenção", "Nova Soure", "Nova Viçosa", "Novo Horizonte", "Novo Triunfo", "Olindina", "Oliveira dos Brejinhos", "Ouriçangas", "Ourolândia", "Palmas de Monte Alto", "Palmeiras", "Paramirim", "Paratinga", "Paripiranga", "Pau Brasil", "Paulo Afonso", "Pé de Serra", "Pedrão", "Pedro Alexandre", "Piatã", "Pilão Arcado", "Pindaí", "Pindobaçu", "Pintadas", "Piraí do Norte", "Piripá", "Piritiba", "Planaltino", "Planalto", "Poções", "Pojuca", "Ponto Novo", "Porto Seguro", "Potiraguá", "Prado", "Presidente Dutra", "Presidente Jânio Quadros", "Presidente Tancredo Neves", "Queimadas", "Quijingue", "Quixabeira", "Rafael Jambeiro", "Remanso", "Retirolândia", "Riachão das Neves", "Riachão do Jacuípe", "Riacho de Santana", "Ribeira do Amparo", "Ribeira do Pombal", "Ribeirão do Largo", "Rio de Contas", "Rio do Antônio", "Rio do Pires", "Rio Real", "Rodelas", "Ruy Barbosa", "Salinas da Margarida", "Salvador", "Santa Bárbara", "Santa Brígida", "Santa Cruz Cabrália", "Santa Cruz da Vitória", "Santa Inês", "Santa Luzia", "Santa Maria da Vitória", "Santa Rita de Cássia", "Santa Teresinha", "Santaluz", "Santana", "Santanópolis", "Santo Amaro", "Santo Antônio de Jesus", "Santo Estêvão", "São Desidério", "São Domingos", "São Felipe", "São Félix", "São Félix do Coribe", "São Francisco do Conde", "São Gabriel", "São Gonçalo dos Campos", "São José da Vitória", "São José do Jacuípe", "São Miguel das Matas", "São Sebastião do Passé", "Sapeaçu", "Sátiro Dias", "Saubara", "Saúde", "Seabra", "Sebastião Laranjeiras", "Senhor do Bonfim", "Sento Sé", "Serra do Ramalho", "Serra Dourada", "Serra Preta", "Serrinha", "Serrolândia", "Simões Filho", "Sítio do Mato", "Sítio do Quinto", "Sobradinho", "Souto Soares", "Tabocas do Brejo Velho", "Tanhaçu", "Tanque Novo", "Tanquinho", "Taperoá", "Tapiramutá", "Teixeira de Freitas", "Teodoro Sampaio", "Teofilândia", "Teolândia", "Terra Nova", "Tremedal", "Tucano", "Uauá", "Ubaíra", "Ubaitaba", "Ubatã", "Uibaí", "Umburanas", "Una", "Urandi", "Uruçuca", "Utinga", "Valença", "Valente", "Várzea da Roça", "Várzea do Poço", "Várzea Nova", "Varzedo", "Vera Cruz", "Vereda", "Vitória da Conquista", "Wagner", "Wanderley", "Wenceslau Guimarães", "Xique-Xique"
];

const Editor = ({ currentProject, updateField, setCurrentDeck, currentDeck, setView, saveProject }) => {
  const [deckInfoVisible, setDeckInfoVisible] = useState(false);
  const [activeHelp, setActiveHelp] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const isReadOnly = currentProject.isLocked === true;

  useEffect(() => {
    if (!isReadOnly) {
      updateField('natureza', 'projeto');
      updateField('instituicao', 'SECTI - Secretaria De Ciência, Tecnologia E Inovação');
      updateField('estado', 'Bahia');
      if (!currentProject.listaInstrumentos) {
        updateField('listaInstrumentos', []);
      }
      if (!currentProject.listaAditivos) {
        updateField('listaAditivos', []);
      }
      if (!currentProject.fonteFinanciamento) {
        updateField('fonteFinanciamento', []);
      }
      if (!currentProject.territorio) {
        updateField('territorio', []);
      }
      if (!currentProject.municipio) {
        updateField('municipio', []);
      }
    }
  }, []);

  const handleFieldFocus = (field) => {
    if (!isReadOnly && HELP_TEXT[field]) setActiveHelp(HELP_TEXT[field]);
  };

  const handleFieldBlur = () => setActiveHelp(null);

  const triggerSave = () => {
    if (isReadOnly) return;
    setModalMode('confirmSave');
  };

  const triggerFinalize = () => {
    if (isReadOnly) return;
    setModalMode('confirmFinalize');
  };

  const executeAction = async (isFinalizing = false) => {
    setModalMode(null);
    
    if (isFinalizing) {
      updateField('isLocked', true);
    }

    await saveProject(); 
    
    setModalMode(isFinalizing ? 'successFinalize' : 'successSave');
    if (!isFinalizing) {
      setTimeout(() => setModalMode(null), 2000);
    }
  };

  const handleImageUpload = async (e) => {
    if (isReadOnly) return;
    const files = Array.from(e.target.files);
    const currentFotos = currentProject.fotos || [];

    const processedImages = await Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_DIM = 600;

            if (width > height) {
              if (width > MAX_DIM) {
                height *= MAX_DIM / width;
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width *= MAX_DIM / height;
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.5));
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }));

    updateField('fotos', [...currentFotos, ...processedImages]);
  };

  const handleDownloadDocument = (doc) => {
    if (doc.tipo === 'application/pdf') {
      fetch(doc.data)
        .then(res => res.blob())
        .then(blob => {
          const fileURL = URL.createObjectURL(blob);
          const pdfWindow = window.open(fileURL, '_blank');
          if (!pdfWindow) {
            alert("O navegador bloqueou a abertura da aba. Permita pop-ups para visualizar o PDF.");
          }
        });
      return;
    }

    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeImage = (index) => {
    if (isReadOnly) return;
    const currentFotos = currentProject.fotos || [];
    const newFotos = currentFotos.filter((_, i) => i !== index);
    updateField('fotos', newFotos);
  };

  const handleDocumentUpload = async (e) => {
    if (isReadOnly) return;
    const files = Array.from(e.target.files);
    const currentDocs = currentProject.documentos || [];
    const MAX_SIZE = 1024 * 1024;

    const processedDocs = await Promise.all(files.map(file => {
      return new Promise((resolve) => {
        if (file.size > MAX_SIZE) {
          alert(`O arquivo "${file.name}" excede o limite máximo de 1MB e foi descartado.`);
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            data: e.target.result,
            dataUpload: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    const validDocs = processedDocs.filter(doc => doc !== null);
    updateField('documentos', [...currentDocs, ...validDocs]);
  };

  const removeDocument = (index) => {
    if (isReadOnly) return;
    const currentDocs = currentProject.documentos || [];
    const newDocs = currentDocs.filter((_, i) => i !== index);
    updateField('documentos', newDocs);
  };

  const addInstrumento = () => {
    const novos = [...(currentProject.listaInstrumentos || []), {
      tipo: '',
      outroTipo: '',
      numero: '',
      vigencia: '',
      ativo: true
    }];
    updateField('listaInstrumentos', novos);
  };

  const removeInstrumento = (index) => {
    const novos = currentProject.listaInstrumentos.filter((_, i) => i !== index);
    updateField('listaInstrumentos', novos);
  };

  const updateInstrumento = (index, field, value) => {
    const novos = currentProject.listaInstrumentos.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateField('listaInstrumentos', novos);
  };

  const addAditivo = () => {
    const novos = [...(currentProject.listaAditivos || []), {
      numeroSei: '',
      numeroInstrumento: '',
      descricao: ''
    }];
    updateField('listaAditivos', novos);
  };

  const removeAditivo = (index) => {
    const novos = currentProject.listaAditivos.filter((_, i) => i !== index);
    updateField('listaAditivos', novos);
  };

  const updateAditivo = (index, field, value) => {
    const novos = currentProject.listaAditivos.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateField('listaAditivos', novos);
  };

  const handleFonteChange = (value, checked) => {
    if (isReadOnly) return;
    
    let currentFontes = currentProject.fonteFinanciamento;
    if (typeof currentFontes === 'string') {
        currentFontes = [currentFontes];
    }
    if (!Array.isArray(currentFontes)) {
        currentFontes = [];
    }

    let newFontes;
    if (checked) {
        newFontes = [...currentFontes, value];
    } else {
        newFontes = currentFontes.filter(f => f !== value);
    }
    updateField('fonteFinanciamento', newFontes);
  };

  const handleMultiSelectChange = (field, value, checked) => {
    if (isReadOnly) return;

    let currentList = currentProject[field];
    if (!Array.isArray(currentList)) {
      currentList = [];
    }

    let newList;
    if (checked) {
      newList = [...currentList, value];
    } else {
      newList = currentList.filter(item => item !== value);
    }
    updateField(field, newList);
  };

  const renderDeckContent = () => {
    switch (currentDeck) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 md:col-span-2">
              <RenderInput
                label="Título do Programa/Projeto" field="titulo" placeholder="Insira o título oficial" required
                value={currentProject.titulo} onChange={(val) => updateField('titulo', val)} onFocus={() => handleFieldFocus('titulo')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <RenderSelect
                label="Status do Projeto" field="status" options={STATUS_OPTIONS} required
                value={currentProject.status} onChange={(val) => updateField('status', val)} onFocus={() => handleFieldFocus('status')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>
        <div className="col-span-1 md:col-span-2">
  <div className="flex items-end gap-4">
    <div className="flex-1">
      <RenderInput
        label="Número do Processo SEI"
        field="numeroProcessoSEI"
        placeholder="000.0000.000000/0000-00"
        required={!currentProject.seiNaoSeAplica}
        value={currentProject.numeroProcessoSEI}
        onChange={(val) => updateField('numeroProcessoSEI', val)}
        onFocus={() => handleFieldFocus('numeroProcessoSEI')}
        onBlur={handleFieldBlur}
        disabled={isReadOnly || currentProject.seiNaoSeAplica}
      />
    </div>

    <div className="checkbox-wrapper mb-5">
      <input
        type="checkbox"
        className="check"
        id="seiNaoSeAplica"
        checked={currentProject.seiNaoSeAplica || false}
        onChange={(e) => {
          updateField('seiNaoSeAplica', e.target.checked);
          if (e.target.checked) updateField('numeroProcessoSEI', 'N/A');
          else updateField('numeroProcessoSEI', '');
        }}
        disabled={isReadOnly}
      />
      <label htmlFor="seiNaoSeAplica" className="label">
        <svg width="45" height="45" viewBox="0 0 95 95">
          <rect
            x="30"
            y="20"
            width="50"
            height="50"
            stroke="currentColor"
            fill="none"
            className="text-slate-300"
          />
          <g transform="translate(0,-952.36222)">
            <path
              d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              className="path1"
            />
          </g>
        </svg>
        <span className="text-[10px] font-black text-slate-500 uppercase">
          Não se aplica
        </span>
      </label>
    </div>
  </div>
</div>


            <div className="col-span-1 md:col-span-2 mt-4">
              <div className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} /> Instrumentos Vinculados
                  </h3>
                  {!isReadOnly && (
                    <button
                      onClick={addInstrumento}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={14} /> Adicionar Instrumento
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {currentProject.listaInstrumentos?.map((inst, idx) => (
                    <div key={idx} className="p-5 bg-white border border-blue-100 rounded-xl shadow-sm relative animate-in fade-in slide-in-from-top-2">
                      {!isReadOnly && (
                        <button
                          onClick={() => removeInstrumento(idx)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors border border-red-200"
                        >
                          <X size={14} />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                          <RenderSelect
                            label="Tipo de Instrumento"
                            options={INSTRUMENTOS_OPTIONS}
                            value={inst.tipo}
                            onChange={(val) => updateInstrumento(idx, 'tipo', val)}
                            disabled={isReadOnly}
                          />
                        </div>

                        {inst.tipo === 'Outros' && (
                          <div className="col-span-1 md:col-span-2">
                            <RenderInput
                              label="Especifique"
                              value={inst.outroTipo}
                              onChange={(val) => updateInstrumento(idx, 'outroTipo', val)}
                              disabled={isReadOnly}
                            />
                          </div>
                        )}

                        <RenderInput
                          label="Número do Instrumento"
                          placeholder="Nº 000/202X"
                          value={inst.numero}
                          onChange={(val) => updateInstrumento(idx, 'numero', val)}
                          disabled={isReadOnly}
                        />

                        <RenderInput
                          label="Vigência"
                          placeholder="DD/MM/AAAA"
                          value={inst.vigencia}
                          onChange={(val) => updateInstrumento(idx, 'vigencia', val)}
                          disabled={isReadOnly}
                        />

                        <div className="col-span-1 md:col-span-2">
                          <div className="checkbox-wrapper">
                            <input
                              type="checkbox"
                              className="check"
                              id={`ativo-${idx}`}
                              checked={inst.ativo}
                              onChange={(e) => updateInstrumento(idx, 'ativo', e.target.checked)}
                              disabled={isReadOnly}
                            />
                            <label htmlFor={`ativo-${idx}`} className="label">
                              <svg width="35" height="35" viewBox="0 0 95 95">
                                <rect x="30" y="20" width="50" height="50" stroke="currentColor" fill="none" className="text-slate-300"></rect>
                                <g transform="translate(0,-952.36222)">
                                  <path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4" stroke="#10b981" strokeWidth="3" fill="none" className="path1"></path>
                                </g>
                              </svg>
                              <span className="text-[10px] font-black text-slate-600 uppercase">Instrumento Vigente</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!currentProject.listaInstrumentos || currentProject.listaInstrumentos.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-blue-100 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Nenhum instrumento adicionado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <div className="p-6 bg-slate-50/50 border-2 border-slate-100 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <FilePlus size={16} />  Aditivos
                  </h3>
                  {!isReadOnly && (
                    <button
                      onClick={addAditivo}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-slate-700 transition-colors"
                    >
                      <Plus size={14} /> Adicionar Aditivo
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {currentProject.listaAditivos?.map((aditivo, idx) => (
                    <div key={idx} className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm relative animate-in fade-in slide-in-from-top-2">
                      {!isReadOnly && (
                        <button
                          onClick={() => removeAditivo(idx)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors border border-red-200"
                        >
                          <X size={14} />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RenderInput
                          label="Número Processo SEI"
                          placeholder="000.0000.000000/0000-00"
                          value={aditivo.numeroSei}
                          onChange={(val) => updateAditivo(idx, 'numeroSei', val)}
                          disabled={isReadOnly}
                        />
                        <RenderInput
                          label="Número do Instrumento"
                          placeholder="Ex: 001/2025"
                          value={aditivo.numeroInstrumento}
                          onChange={(val) => updateAditivo(idx, 'numeroInstrumento', val)}
                          disabled={isReadOnly}
                        />
                        <div className="col-span-1 md:col-span-2">
                          <RenderInput
                            label="Descrição do Aditivo"
                            placeholder="Descreva o objetivo do aditivo..."
                            value={aditivo.descricao}
                            onChange={(val) => updateAditivo(idx, 'descricao', val)}
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!currentProject.listaAditivos || currentProject.listaAditivos.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Nenhum aditivo adicionado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <RenderInput
                label="Instituição Proponente" field="instituicao" required
                value="SECTI - Secretaria De Ciência, Tecnologia E Inovação"
                onChange={() => { }}
                disabled={true}
                className="bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <RenderSelect
                label="Unidade Executora" field="unidade" options={UNIDADES_EXECUTORAS} required
                value={currentProject.unidade} onChange={(val) => updateField('unidade', val)} onFocus={() => handleFieldFocus('unidade')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <RenderSelect
                label="Responsável" field="responsavel" options={RESPONSAVEIS} required
                value={currentProject.responsavel} onChange={(val) => updateField('responsavel', val)} onFocus={() => handleFieldFocus('responsavel')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <RenderInput
                label="Parceiros" field="parceiros"
                value={currentProject.parceiros} onChange={(val) => updateField('parceiros', val)} onFocus={() => handleFieldFocus('parceiros')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <RenderInput
                label="Período de Execução do Projeto" field="periodo" placeholder="Ex: 12 meses" required
                value={currentProject.periodo} onChange={(val) => updateField('periodo', val)} onFocus={() => handleFieldFocus('periodo')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <RenderInput label="Caracterização do Contexto" field="contexto" height="h-32" required value={currentProject.contexto} onChange={(val) => updateField('contexto', val)} onFocus={() => handleFieldFocus('contexto')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Problema ou Demanda" field="problemaDemanda" height="h-28" required value={currentProject.problemaDemanda} onChange={(val) => updateField('problemaDemanda', val)} onFocus={() => handleFieldFocus('problemaDemanda')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Justificativa" field="justificativa" height="h-28" required value={currentProject.justificativa} onChange={(val) => updateField('justificativa', val)} onFocus={() => handleFieldFocus('justificativa')} onBlur={handleFieldBlur} disabled={isReadOnly} />

            <RenderSelect
              label="Fundamentação Legal"
              field="fundamentacaoLegal"
              options={FUNDAMENTACAO_LEGAL_OPTIONS}
              required
              value={currentProject.fundamentacaoLegal}
              onChange={(val) => updateField('fundamentacaoLegal', val)}
              onFocus={() => handleFieldFocus('fundamentacaoLegal')}
              onBlur={handleFieldBlur}
              disabled={isReadOnly}
            />

            {currentProject.fundamentacaoLegal === 'Outro(s)' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <RenderInput
                  label="Descreva a Fundamentação Legal"
                  field="fundamentacaoLegalOutros"
                  height="h-24"
                  placeholder="Cite a lei ou decreto específico"
                  required
                  value={currentProject.fundamentacaoLegalOutros}
                  onChange={(val) => updateField('fundamentacaoLegalOutros', val)}
                  onFocus={() => handleFieldFocus('fundamentacaoLegalOutros')}
                  onBlur={handleFieldBlur}
                  disabled={isReadOnly}
                />
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <RenderInput label="Objetivo Geral" field="objetivoGeral" height="h-24" required value={currentProject.objetivoGeral} onChange={(val) => updateField('objetivoGeral', val)} onFocus={() => handleFieldFocus('objetivoGeral')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Objetivos Específicos" field="objetivosEspecificos" height="h-32" required value={currentProject.objetivosEspecificos} onChange={(val) => updateField('objetivosEspecificos', val)} onFocus={() => handleFieldFocus('objetivosEspecificos')} onBlur={handleFieldBlur} disabled={isReadOnly} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RenderInput label="Beneficiários" field="beneficiarios" required value={currentProject.beneficiarios} onChange={(val) => updateField('beneficiarios', val)} onFocus={() => handleFieldFocus('beneficiarios')} onBlur={handleFieldBlur} disabled={isReadOnly} />
              <RenderInput label="Número de Beneficiários" field="nmrBeneficiarios" type="number" required value={currentProject.nmrBeneficiarios} onChange={(val) => updateField('nmrBeneficiarios', val)} onFocus={() => handleFieldFocus('nmrBeneficiarios')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            </div>

            <RenderSelect 
                label="Localização Geográfica (Abrangência)" 
                field="localExecucao" 
                options={TIPO_LOCALIZACAO_OPTIONS}
                required 
                value={currentProject.localExecucao} 
                onChange={(val) => updateField('localExecucao', val)} 
                onFocus={() => handleFieldFocus('localExecucao')} 
                onBlur={handleFieldBlur} 
                disabled={isReadOnly} 
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentProject.localExecucao === 'Estado' && (
                  <RenderInput label="Estado" field="estado" value="Bahia" disabled={true} className="bg-slate-100 text-slate-500 cursor-not-allowed" />
              )}
              
              {currentProject.localExecucao === 'Território' && (
                  <div className="md:col-span-3">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-tight ml-1 mb-2 block">
                          Territórios
                      </label>
                      <div className="h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white space-y-2 animate-in fade-in slide-in-from-top-1">
                        {TERRITORIOS_BAHIA.map((item) => {
                            const currentList = Array.isArray(currentProject.territorio) ? currentProject.territorio : [];
                            const isSelected = currentList.includes(item.value);
                            return (
                                <label key={item.value} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        checked={isSelected}
                                        onChange={(e) => handleMultiSelectChange('territorio', item.value, e.target.checked)}
                                        disabled={isReadOnly}
                                    />
                                    <span className={`text-xs ${isSelected ? 'font-bold text-blue-700' : 'text-slate-600'}`}>{item.label}</span>
                                </label>
                            );
                        })}
                      </div>
                  </div>
              )}

              {currentProject.localExecucao === 'Município' && (
                  <div className="md:col-span-3">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-tight ml-1 mb-2 block">
                          Municípios
                      </label>
                      <div className="h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white space-y-2 animate-in fade-in slide-in-from-top-1">
                        {MUNICIPIOS_BAHIA.map((item) => {
                            const value = typeof item === 'string' ? item : item.value;
                            const label = typeof item === 'string' ? item : item.label;
                            const currentList = Array.isArray(currentProject.municipio) ? currentProject.municipio : [];
                            const isSelected = currentList.includes(value);

                            return (
                                <label key={value} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        checked={isSelected}
                                        onChange={(e) => handleMultiSelectChange('municipio', value, e.target.checked)}
                                        disabled={isReadOnly}
                                    />
                                    <span className={`text-xs ${isSelected ? 'font-bold text-blue-700' : 'text-slate-600'}`}>{label}</span>
                                </label>
                            );
                        })}
                      </div>
                  </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <RenderInput label="Recursos Humanos" field="recursosHumanos" height="h-28" required value={currentProject.recursosHumanos} onChange={(val) => updateField('recursosHumanos', val)} onFocus={() => handleFieldFocus('recursosHumanos')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Recursos Materiais" field="recursosMaterials" height="h-28" value={currentProject.recursosMateriais} onChange={(val) => updateField('recursosMateriais', val)} onFocus={() => handleFieldFocus('recursosMateriais')} onBlur={handleFieldBlur} disabled={isReadOnly} />

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={14} /> Recursos Financeiros
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RenderInput label="Investimentos (R$)" field="investimentoReal" placeholder="Ex: 50.000,00" value={currentProject.investimentoReal} onChange={(val) => updateField('investimentoReal', val)} onFocus={() => handleFieldFocus('investimentoReal')} onBlur={handleFieldBlur} disabled={isReadOnly} />
                <RenderInput label="PAOE" field="paoe" placeholder="Identificação PAOE" value={currentProject.paoe} onChange={(val) => updateField('paoe', val)} onFocus={() => handleFieldFocus('paoe')} onBlur={handleFieldBlur} disabled={isReadOnly} />
              </div>

              <div className="space-y-3" onFocus={() => handleFieldFocus('fonteFinanciamento')} onBlur={handleFieldBlur}>
                <label className="text-xs font-black text-slate-700 uppercase tracking-tight ml-1">
                    Fontes de Financiamento <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FONTES_FINANCIAMENTO.map((option) => {
                        const currentFontes = Array.isArray(currentProject.fonteFinanciamento) 
                            ? currentProject.fonteFinanciamento 
                            : (typeof currentProject.fonteFinanciamento === 'string' && currentProject.fonteFinanciamento === option.value ? [option.value] : []);
                        
                        const isSelected = currentFontes.includes(option.value);

                        return (
                            <label key={option.value} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    checked={isSelected}
                                    onChange={(e) => handleFonteChange(option.value, e.target.checked)}
                                    disabled={isReadOnly}
                                />
                                <span className={`text-xs font-bold uppercase ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                                    {option.label}
                                </span>
                            </label>
                        )
                    })}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <RenderInput label="Meta Física" field="metaFisica" height="h-32" required value={currentProject.metaFisica} onChange={(val) => updateField('metaFisica', val)} onFocus={() => handleFieldFocus('metaFisica')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Execução Física" field="execucaoFisica" height="h-32" value={currentProject.execucaoFisica} onChange={(val) => updateField('execucaoFisica', val)} onFocus={() => handleFieldFocus('execucaoFisica')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Execução Financeira" field="execucaoFinanceira" height="h-32" value={currentProject.execucaoFinanceira} onChange={(val) => updateField('execucaoFinanceira', val)} onFocus={() => handleFieldFocus('execucaoFinanceira')} onBlur={handleFieldBlur} disabled={isReadOnly} />
          </div>
        );
      case 5:
        return (
          <>
            <div className="space-y-6">
              <RenderInput label="Sustentabilidade" field="sustentabilidade" height="h-28" value={currentProject.sustentabilidade} onChange={(val) => updateField('sustentabilidade', val)} onFocus={() => handleFieldFocus('sustentabilidade')} onBlur={handleFieldBlur} disabled={isReadOnly} />
              <RenderInput label="Riscos e Mitigação" field="riscos" height="h-28" value={currentProject.riscos} onChange={(val) => updateField('riscos', val)} onFocus={() => handleFieldFocus('riscos')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            </div>

            <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} /> Anexos Técnicos (PDF/DOCX)
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                  {currentProject.documentos ? currentProject.documentos.length : 0}
                </span>
              </div>

              {!isReadOnly && (
                <div className="mb-6">
                  <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-all group">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <FilePlus className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs text-slate-400 font-bold uppercase group-hover:text-blue-500">Anexar Documento</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Máx: 1MB (PDF, DOC, DOCX)</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      multiple
                      onChange={handleDocumentUpload}
                    />
                  </label>
                </div>
              )}

              <div className="space-y-3">
                {currentProject.documentos && currentProject.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-left-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-black text-slate-700 truncate uppercase tracking-tight max-w-[150px] md:max-w-[300px]" title={doc.nome}>
                          {doc.nome}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {Math.round(doc.tamanho / 1024)} KB • {new Date(doc.dataUpload).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Baixar/Abrir documento"
                      >
                        <Download size={16} />
                      </button>

                      {!isReadOnly && (
                        <button
                          onClick={() => removeDocument(index)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remover anexo"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {(!currentProject.documentos || currentProject.documentos.length === 0) && (
                  <div className="text-center py-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase opacity-60">Nenhum documento anexado</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RenderInput label="Pendências" field="pendencias" height="h-32" value={currentProject.pendencias} onChange={(val) => updateField('pendencias', val)} onFocus={() => handleFieldFocus('pendencias')} onBlur={handleFieldBlur} disabled={isReadOnly} />
                <RenderInput label="Observações" field="observacoes" height="h-32" value={currentProject.observacoes} onChange={(val) => updateField('observacoes', val)} onFocus={() => handleFieldFocus('observacoes')} onBlur={handleFieldBlur} disabled={isReadOnly} />
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Camera size={14} /> Registros Fotográficos (Min. 4)
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">{currentProject.fotos ? currentProject.fotos.length : 0}</span>
                </div>

                {!isReadOnly && (
                  <div className="mb-6">
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors mb-2" />
                        <p className="text-xs text-slate-400 font-bold uppercase group-hover:text-blue-500">Adicionar Foto</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentProject.fotos && currentProject.fotos.map((foto, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-white shadow-sm">
                      <img src={foto} alt={`Registro ${index + 1}`} className="w-full h-full object-cover" />
                      {!isReadOnly && (
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"
                          title="Remover imagem"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8 relative pb-20 lg:pb-0">
      <div className={`fixed top-6 right-6 z-[110] transition-all duration-500 transform ${activeHelp ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="relative w-[330px]  rounded-lg bg-white shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex items-center justify-around gap-[15px] px-[15px] py-[10px] overflow-hidden border border-slate-50">
          <svg className="absolute rotate-90 -left-[31px] top-[32px] w-[80px] fill-[#4777ff3a] h-100" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"></path>
          </svg>
          <div className="w-[35px] h-[35px] flex items-center justify-center bg-[#4777ff48] rounded-full ml-2 shrink-0">
            <svg className="w-[17px] h-[17px] text-[#124fff]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"></path>
              <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"></path>
            </svg>
          </div>
          <div className="flex flex-col justify-center items-start grow">
            <p className="text-[#124fff] text-base font-bold m-0 leading-tight w-full">{activeHelp?.text || 'Dica Técnica'}</p>
            <p className="text-sm text-slate-500 m-0 leading-tight w-full">{activeHelp?.sub || 'Informação relevante para este campo'}</p>
          </div>
          <X onClick={() => setActiveHelp(null)} className="w-[18px] h-[18px] text-slate-400 cursor-pointer hover:text-slate-600 transition-colors shrink-0" />
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-t-3xl md:rounded-[2rem] w-full max-w-sm shadow-2xl border border-white animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />
            {modalMode === 'confirmSave' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Save size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase mb-2">Salvar Alterações?</h3>
                <p className="text-sm text-slate-500 mb-6">Confirmar a gravação dos dados atuais no sistema?</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => setModalMode(null)} className="flex-1 py-4 md:py-3 text-xs font-bold uppercase text-slate-400">Voltar</button>
                  <button onClick={() => executeAction(false)} className="flex-1 py-4 md:py-3 bg-blue-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg">Confirmar</button>
                </div>
              </div>
            )}
            {modalMode === 'confirmFinalize' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase mb-2">Finalizar Proposta?</h3>
                <p className="text-sm text-slate-500 mb-6">Ao enviar para análise, a edição será bloqueada permanentemente. O status selecionado será mantido.</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => setModalMode(null)} className="flex-1 py-4 md:py-3 text-xs font-bold uppercase text-slate-400">Revisar</button>
                  <button onClick={() => executeAction(true)} className="flex-1 py-4 md:py-3 bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg">Enviar Agora</button>
                </div>
              </div>
            )}
            {(modalMode === 'successSave' || modalMode === 'successFinalize') && (
              <div className="text-center py-4 animate-in zoom-in-95">
                <div className={`w-16 h-16 ${modalMode === 'successSave' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {modalMode === 'successSave' ? <CheckCircle2 size={40} /> : <Send size={40} />}
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase">Operação Concluída</h3>
                <p className="text-xs text-slate-500">O sistema processou os dados com sucesso.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="lg:w-72">
        <DeckNavigation currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} />
      </div>

      <div className="flex-1 px-4 lg:px-0">
        <HudBorder className="bg-white border border-slate-100 rounded-2xl lg:rounded-3xl shadow-xl p-4 md:p-8 flex flex-col relative min-h-[calc(100vh-16rem)]">
          {isReadOnly && (
            <div className="absolute top-0 left-0 right-0 bg-slate-800 text-white py-2 px-4 flex items-center justify-center gap-2 z-20">
              <Lock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Visualização em modo de leitura</span>
            </div>
          )}

          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-slate-100 ${isReadOnly ? 'mt-8' : ''}`}>
            <div className="flex items-center gap-3">
              <SectiLogo size="medium" />
              <div>
                <h2 className="text-lg font-black text-slate-800 uppercase leading-none">Módulo {currentDeck + 1}</h2>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter mt-1">{DECKS[currentDeck]?.nome || 'Novo Módulo'}</p>
              </div>
            </div>
            {!isReadOnly && (
              <button onClick={triggerSave} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95">
                <Save size={16} /> Salvar Progresso
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-visible">
            <div className="mb-8">
              <button onClick={() => setDeckInfoVisible(!deckInfoVisible)} className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${(DECKS[currentDeck]?.color || 'text-slate-400').replace('text-', 'bg-')} bg-opacity-10`}>
                    <BookOpen size={18} className={DECKS[currentDeck]?.color || 'text-slate-400'} />
                  </div>
                  <span className="text-xs font-black text-slate-700 uppercase">Instruções de Preenchimento</span>
                </div>
                <ChevronRight size={18} className={`text-slate-400 transition-transform ${deckInfoVisible ? 'rotate-90' : ''}`} />
              </button>
              {deckInfoVisible && (
                <div className="mt-2 p-4 text-xs text-slate-600 bg-white border border-slate-100 rounded-xl leading-relaxed animate-in fade-in slide-in-from-top-1">
                  {DECKS[currentDeck]?.deckInfo || 'Preencha os campos abaixo conforme solicitado.'}
                </div>
              )}
            </div>

            {renderDeckContent()}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2 order-2 md:order-1">
                <div className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded border border-slate-200">
                  Status: {currentProject.status || 'Em fase de planejamento'}
                </div>
              </div>
              <div className="flex gap-2 order-1 md:order-2">
                {currentDeck > 0 && (
                  <button onClick={() => setCurrentDeck(currentDeck - 1)} className="flex-1 md:flex-none px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase active:scale-95 transition-all">
                    Anterior
                  </button>
                )}
                {currentDeck < 5 ? (
                  <button onClick={() => setCurrentDeck(currentDeck + 1)} className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95 transition-all">
                    Próximo
                  </button>
                ) : (
                  <button onClick={triggerFinalize} disabled={isReadOnly} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase shadow-lg transition-all active:scale-95 ${isReadOnly ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white'}`}>
                    Finalizar e Enviar
                  </button>
                )}
              </div>
            </div>
          </div>
        </HudBorder>
      </div>
    </div>
  );
};

export default Editor;