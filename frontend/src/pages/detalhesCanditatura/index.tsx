import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Link as LinkIcon,
  MapPin,
  MessageSquare,
  PartyPopper,
  Save,
  Search,
  Send,
  Terminal,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import Modal from "../../components/Modal";
import { Tabs } from "../../components/Tabs";
import Button from "../../components/Button";
import type { Job, JobTrack, JobStatus } from "../../types";
import { formatDate } from "../../utils/formatDate";
import {
  BackButton,
  Container,
  ContentSection,
  EditField,
  EditGrid,
  EditLabel,
  FormActions,
  HeaderMetaBlock,
  HeaderMetaGroup,
  HeaderTitleRow,
  IconButton,
  InlineForm,
  JobHeader,
  JobIdentity,
  Layout,
  List,
  ListEmpty,
  ListItem,
  ListItemText,
  Logo,
  MainColumn,
  OverviewBlock,
  OverviewGrid,
  OverviewItem,
  OverviewLabel,
  OverviewTitle,
  OverviewValue,
  Page,
  Panel,
  Paragraph,
  SectionBody,
  SectionCard,
  SectionHeader,
  SectionTitle,
  Sidebar,
  SmallButton,
  StatusBadge,
  SubTitle,
  TextArea,
  TextInput,
  TimelineConnector,
  TimelineIconWrapper,
  TimelineItem,
  TimelineItemHeader,
  TimelineList,
  TimelineSubtitle,
  TimelineText,
  TimelineTitle,
  Title,
  TitleBlock,
  ResourceList,
  BulletList,
  BulletItem,
  Notes,
  ReminderCard,
  ReminderEyebrow,
  ReminderIcon,
  Select,
} from "./styles";

type TimelineEvent = {
  title: string;
  subtitle: string;
  icon?: LucideIcon | "activity" | "check" | "clock";
};

type ResourceLink = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const statusToTone: Record<string, "yellow" | "green" | "blue" | "red" | "gray"> = {
  Lead: "gray",
  Applied: "blue",
  Viewed: "blue",
  Contacted: "yellow",
  Interview: "yellow",
  TechnicalTest: "yellow",
  Offer: "green",
  Accepted: "green",
  Rejected: "red",
  Withdrawn: "gray",
  Closed: "gray",
};

const statusToIcon: Record<string, LucideIcon> = {
  Lead: Flag,
  Applied: Send,
  Viewed: Eye,
  Contacted: MessageSquare,
  Interview: Users,
  TechnicalTest: Code,
  Offer: FileText,
  Accepted: CheckCircle2,
  Rejected: X,
  Withdrawn: ArrowLeft,
  Closed: Flag,
};

const trackLabels: Record<JobTrack, string> = {
  AI: "IA / ML",
  FULL_STACK: "Full Stack",
  CLOUD: "Cloud",
};

const historyIconMap: Record<string, LucideIcon> = {
  search: Search,
  send: Send,
  eye: Eye,
  message: MessageSquare,
  users: Users,
  code: Code,
  terminal: Terminal,
  briefcase: Briefcase,
  "file-text": FileText,
  "check-circle": CheckCircle2,
  flag: Flag,
  check: CheckCircle2,
  clock: Clock,
  activity: Activity,
};

const PREDEFINED_EVENTS = [
  { title: "Vaga identificada", icon: "search" },
  { title: "Candidatura enviada", icon: "send" },
  { title: "Candidatura visualizada", icon: "eye" },
  { title: "Contato inicial", icon: "message" },
  { title: "Entrevista RH", icon: "users" },
  { title: "Teste técnico", icon: "code" },
  { title: "Entrevista técnica", icon: "terminal" },
  { title: "Entrevista final", icon: "briefcase" },
  { title: "Proposta recebida", icon: "file-text" },
  { title: "Proposta aceita", icon: "check-circle" },
  { title: "Processo encerrado", icon: "flag" },
] as const;

const buildMetaState = (job: Job) => ({
  company: job.company ?? "",
  position: job.title ?? "",
  track: job.track ?? "AI",
  status: job.status,
  date: job.date,
  location: job.location ?? "Remoto",
  externalLink: job.externalLink ?? "",
});

const DetalhesCandidatura = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    jobs,
    isLoading,
    updateJob,
    addHistoryEntry,
    addResource,
    removeResource,
    addReminder,
    removeReminder,
    toggleArchive,
  } = useJobs();

  const job = useMemo(() => jobs.find((item) => item.id === id), [jobs, id]);

  const [notesDraft, setNotesDraft] = useState(
    Array.isArray(job?.notes) ? job?.notes.join("\n") : job?.notes ?? ""
  );
  const [newResource, setNewResource] = useState({ label: "", href: "" });
  const [newReminder, setNewReminder] = useState("");
  const [newHistory, setNewHistory] = useState({ title: "", subtitle: "" });
  const [customTitle, setCustomTitle] = useState("");
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState("basic");
  const [editFormState, setEditFormState] = useState<Partial<Job>>({});
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const [metaDraft, setMetaDraft] = useState(() =>
    job
      ? buildMetaState(job)
      : { company: "", position: "", track: "AI" as JobTrack, status: "Aplicada", date: "", location: "Remoto", externalLink: "" }
  );

  useEffect(() => {
    setNotesDraft(Array.isArray(job?.notes) ? job?.notes.join("\n") : job?.notes ?? "");
    if (job) {
      setMetaDraft(buildMetaState(job));
    }
  }, [job]);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!job)
      return [
        { title: "Aplicacao", subtitle: "-", icon: CheckCircle2 },
        { title: "Status atual", subtitle: "-", icon: Clock },
      ];

    const statusIcon = statusToIcon[job.status] ?? Clock;
    return [
      {
        title: "Aplicacao enviada",
        subtitle: formatDate(job.date),
        icon: CheckCircle2,
      },
      {
        title: "Status atual",
        subtitle: job.status,
        icon: statusIcon,
      },
    ];
  }, [job]);

  const resources: ResourceLink[] = [
    ...(job?.resources ?? []).map(
      (r) => ({ ...r, icon: ExternalLink } as ResourceLink)
    ),
  ];

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSaveNotes = () => {
    if (!job) return;
    updateJob(job.id, {
      notes: notesDraft
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  const handleSaveMeta = async (overrides?: Partial<typeof metaDraft>) => {
    if (!job) return;

    const nextDraft = { ...metaDraft, ...overrides };
    const nextDate = nextDraft.date || job.date;

    const hasStatusChange = nextDraft.status !== job.status;
    const hasDateChange = nextDate !== job.date;

    const patch: Partial<Job> = {
      status: nextDraft.status as JobStatus,
      date: nextDate,
      location: nextDraft.location,
      externalLink: nextDraft.externalLink,
      track: nextDraft.track,
      company: nextDraft.company,
      title: nextDraft.position,
    };

    let updatedHistory = job.history ? [...job.history] : undefined;

    if (hasDateChange) {
      const applicationIndex = updatedHistory?.findIndex(
        (entry) => entry.title === "Aplicacao enviada" || entry.icon === "check"
      );

      const newCreatedAt = nextDate ? new Date(nextDate).toISOString() : job.date;

      if (
        applicationIndex !== undefined &&
        applicationIndex >= 0 &&
        updatedHistory
      ) {
        updatedHistory[applicationIndex] = {
          ...updatedHistory[applicationIndex],
          subtitle: formatDate(nextDate),
          createdAt: newCreatedAt,
        };
      } else {
        const applicationEntry = {
          title: "Aplicacao enviada",
          subtitle: formatDate(nextDate),
          icon: "check" as const,
          createdAt: newCreatedAt,
        };
        updatedHistory = [applicationEntry, ...(updatedHistory ?? [])];
      }
    }

    if (hasStatusChange) {
      const now = new Date().toISOString();
      const newHistoryEntry = {
        title: `Status alterado para ${nextDraft.status}`,
        subtitle: `Mudou de "${job.status}" para "${nextDraft.status}" em ${formatDate(now)}`,
        icon: "activity" as const,
        createdAt: now,
      };
      updatedHistory = [
        ...(updatedHistory ?? job.history ?? []),
        newHistoryEntry,
      ];
    }

    await updateJob(job.id, {
      ...patch,
      ...(updatedHistory ? { history: updatedHistory } : {}),
    });

    setMetaDraft({ ...nextDraft, date: nextDate });
    setIsEditingMeta(false);
  };

  const handleCancelMeta = () => {
    if (job) {
      setMetaDraft(buildMetaState(job));
    }
    setIsEditingMeta(false);
  };

  const handleOpenEditModal = () => {
    if (job) {
      setEditFormState({
        ...job,
        responsibilities: job.responsibilities ?? [],
        benefits: job.benefits ?? [],
        notes: job.notes ?? [],
        resources: job.resources ?? [],
        reminders: job.reminders ?? [],
        history: job.history ?? [],
      });
      setActiveEditTab("basic");
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditFormState({});
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    // Remove campos vazios ou null para evitar erros de validação
    const cleanedData = Object.entries(editFormState).reduce((acc, [key, value]) => {
      // Não envia campos que são strings vazias, null ou undefined
      if (value === "" || value === null || value === undefined) {
        return acc;
      }
      // Não envia arrays vazios
      if (Array.isArray(value) && value.length === 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {} as Partial<Job>);

    console.log("Dados sendo enviados para update:", cleanedData);
    
    try {
      await updateJob(job.id, cleanedData);
      console.log("Update concluído com sucesso");
      handleCloseEditModal();
    } catch (error) {
      console.error("Erro ao atualizar job:", error);
      alert("Erro ao salvar alterações. Verifique o console para mais detalhes.");
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !newResource.label || !newResource.href) return;
    addResource(job.id, newResource);
    setNewResource({ label: "", href: "" });
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !newReminder.trim()) return;
    addReminder(job.id, newReminder.trim());
    setNewReminder("");
  };

  const handleAddHistory = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = newHistory.title === "__custom__" ? customTitle : newHistory.title;
    if (!job || !finalTitle || !newHistory.subtitle) return;
    
    const selectedEvent = PREDEFINED_EVENTS.find(ev => ev.title === newHistory.title);
    const eventIcon = selectedEvent?.icon || "activity";
    
    addHistoryEntry(job.id, {
      title: finalTitle,
      subtitle: newHistory.subtitle,
      icon: eventIcon as any,
      createdAt: new Date().toISOString(),
    });
    setNewHistory({ title: "", subtitle: "" });
    setCustomTitle("");
  };

  const handleRemoveHistory = (index: number) => {
    if (!job || !job.history) return;
    const newHistory = job.history.filter((_, i) => i !== index);
    updateJob(job.id, { history: newHistory });
  };

  const resolveIcon = (icon: TimelineEvent["icon"]) => {
    if (!icon) return Activity;
    if (typeof icon === "string") {
      return historyIconMap[icon] ?? Activity;
    }
    return icon;
  };

  if (isLoading) {
    return (
      <Page>
        <Container>
          <BackButton type="button" onClick={handleBack}>
            <ArrowLeft size={18} /> Voltar
          </BackButton>
          <Panel>
            <SectionTitle>
              <Activity size={20} />
              Carregando...
            </SectionTitle>
            <Notes>
              Estamos carregando os dados da candidatura. Por favor, aguarde.
            </Notes>
          </Panel>
        </Container>
      </Page>
    );
  }

  if (!job) {
    return (
      <Page>
        <Container>
          <BackButton type="button" onClick={handleBack}>
            <ArrowLeft size={18} /> Voltar
          </BackButton>
          <Panel>
            <SectionTitle>
              <Activity size={20} />
              Candidatura nao encontrada
            </SectionTitle>
            <Notes>
              Nao localizamos os dados da candidatura. Tente voltar e selecionar
              outra vaga.
            </Notes>
          </Panel>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <BackButton type="button" onClick={handleBack}>
          <ArrowLeft size={18} />
          Voltar ao Dashboard
        </BackButton>

        <Layout>
          <MainColumn>

            <Panel>
              <JobHeader>
                <JobIdentity>
                  <Logo>
                    <Building2 size={36} />
                  </Logo>
                  <TitleBlock>
                    <HeaderTitleRow>
                      <Title>{metaDraft.position}</Title>
                      <StatusBadge tone={statusToTone[job.status] ?? "blue"}>
                        {job.status}
                      </StatusBadge>
                    </HeaderTitleRow>
                    <HeaderMetaBlock>
                      <HeaderMetaGroup>
                        <Briefcase size={14} />
                        {metaDraft.track && trackLabels[metaDraft.track as JobTrack]}
                      </HeaderMetaGroup>
                      <HeaderMetaGroup>
                        <Building2 size={14} />
                        {metaDraft.company}
                      </HeaderMetaGroup>
                      <HeaderMetaGroup>
                        <MapPin size={14} />
                        {metaDraft.location ?? "Remoto"}
                      </HeaderMetaGroup>
                      <HeaderMetaGroup>
                        <Calendar size={14} />
                        {formatDate(job.date)}
                      </HeaderMetaGroup>
                      {job.postedAt && (
                        <HeaderMetaGroup>
                          <Clock size={14} />
                          Publicada em {formatDate(job.postedAt)}
                        </HeaderMetaGroup>
                      )}
                    </HeaderMetaBlock>
                  </TitleBlock>
                </JobIdentity>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <IconButton
                    type="button"
                    onClick={handleOpenEditModal}
                    title="Editar candidatura"
                  >
                    <Edit3 size={18} />
                  </IconButton>
                  {metaDraft.externalLink && (
                    <IconButton
                      type="button"
                      as="a"
                      href={metaDraft.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      title="Ver anuncio original"
                    >
                      <ExternalLink size={18} />
                    </IconButton>
                  )}
                </div>
              </JobHeader>
            </Panel>

            <Panel>
              <SectionHeader>
                <SectionTitle>
                  <BriefcaseBusiness size={20} />
                  Sobre a vaga
                </SectionTitle>
                <OverviewTitle>Overview of the role</OverviewTitle>
              </SectionHeader>

              <OverviewBlock>
                <OverviewGrid>
                  {job.title && (
                    <OverviewItem>
                      <OverviewLabel>Position</OverviewLabel>
                      <OverviewValue>{job.title}</OverviewValue>
                    </OverviewItem>
                  )}
                  {job.company && (
                    <OverviewItem>
                      <OverviewLabel>Company</OverviewLabel>
                      <OverviewValue>{job.company}</OverviewValue>
                    </OverviewItem>
                  )}
                  {job.location && (
                    <OverviewItem>
                      <OverviewLabel>Location</OverviewLabel>
                      <OverviewValue>{job.location}</OverviewValue>
                    </OverviewItem>
                  )}
                  {job.workModel && (
                    <OverviewItem>
                      <OverviewLabel>Work Model</OverviewLabel>
                      <OverviewValue>{job.workModel}</OverviewValue>
                    </OverviewItem>
                  )}
                  {job.employmentType && (
                    <OverviewItem>
                      <OverviewLabel>Employment Type</OverviewLabel>
                      <OverviewValue>{job.employmentType}</OverviewValue>
                    </OverviewItem>
                  )}
                  {job.seniority && (
                    <OverviewItem>
                      <OverviewLabel>Seniority Level</OverviewLabel>
                      <OverviewValue>{job.seniority}</OverviewValue>
                    </OverviewItem>
                  )}
                  {job.postedAt && (
                    <OverviewItem>
                      <OverviewLabel>Posted at</OverviewLabel>
                      <OverviewValue>{formatDate(job.postedAt)}</OverviewValue>
                    </OverviewItem>
                  )}
                </OverviewGrid>
              </OverviewBlock>

              <SectionCard>
                <SectionBody>
                  {job.description && job.description.trim().length > 0 && (
                    <ContentSection>
                      <SubTitle>Descricao</SubTitle>
                      {job.description
                        .split(/\n{2,}/)
                        .filter((paragraph) => paragraph.trim().length > 0)
                        .map((paragraph, idx) => (
                          <Paragraph key={idx}>{paragraph.trim()}</Paragraph>
                        ))}
                    </ContentSection>
                  )}

                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <ContentSection>
                      <SubTitle>Responsabilidades</SubTitle>
                      <BulletList>
                        {job.responsibilities.map((resp, idx) => (
                          <BulletItem key={idx}>{resp}</BulletItem>
                        ))}
                      </BulletList>
                    </ContentSection>
                  )}

                  {job.benefits && job.benefits.length > 0 && (
                    <ContentSection>
                      <SubTitle>Beneficios</SubTitle>
                      <BulletList>
                        {job.benefits.map((benefit, idx) => (
                          <BulletItem key={idx}>{benefit}</BulletItem>
                        ))}
                      </BulletList>
                    </ContentSection>
                  )}

                  {job.additionalInfo && job.additionalInfo.trim().length > 0 && (
                    <ContentSection>
                      <SubTitle>Informacoes adicionais</SubTitle>
                      {job.additionalInfo
                        .split(/\n{2,}/)
                        .filter((paragraph) => paragraph.trim().length > 0)
                        .map((paragraph, idx) => (
                          <Paragraph key={idx}>{paragraph.trim()}</Paragraph>
                        ))}
                    </ContentSection>
                  )}
                </SectionBody>
              </SectionCard>
            </Panel>

            <Panel>
              <SectionTitle>
                <MessageSquare size={20} />
                Anotacoes do candidato
              </SectionTitle>
              <Notes>
                <TextArea
                  ref={notesRef}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Adicione anotacoes sobre a candidatura..."
                />
                <FormActions style={{ marginTop: 10 }}>
                  <SmallButton
                    type="button"
                    variant="primary"
                    onClick={handleSaveNotes}
                  >
                    Salvar anotacoes
                  </SmallButton>
                </FormActions>
              </Notes>
            </Panel>
          </MainColumn>

          <Sidebar>
            <Panel style={{ border: "2px solid #6366f1", borderRadius: "12px" }}>
              <SectionTitle style={{ marginBottom: "20px", textTransform: "uppercase", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em" }}>
                Gestao da Candidatura
              </SectionTitle>

              {isEditingMeta ? (
                <>
                  <EditGrid style={{ marginBottom: "20px" }}>
                    <EditField>
                      <EditLabel>Empresa</EditLabel>
                      <TextInput
                        value={metaDraft.company}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            company: e.target.value,
                          })
                        }
                        placeholder="Nome da empresa"
                      />
                    </EditField>
                    <EditField>
                      <EditLabel>Cargo</EditLabel>
                      <TextInput
                        value={metaDraft.position}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            position: e.target.value,
                          })
                        }
                        placeholder="Titulo da vaga"
                      />
                    </EditField>
                    <EditField>
                      <EditLabel>Trilha</EditLabel>
                      <Select
                        value={metaDraft.track}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            track: e.target.value as JobTrack,
                          })
                        }
                      >
                        {Object.entries(trackLabels).map(([track, label]) => (
                          <option key={track} value={track}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </EditField>
                    <EditField>
                      <EditLabel>Status</EditLabel>
                      <Select
                        value={metaDraft.status}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            status: e.target.value as any,
                          })
                        }
                      >
                        <option value="Lead">Lead (Salva)</option>
                        <option value="Applied">Aplicada</option>
                        <option value="Viewed">Visualizada</option>
                        <option value="Contacted">Contatado</option>
                        <option value="Interview">Entrevista</option>
                        <option value="TechnicalTest">Teste Tecnico</option>
                        <option value="Offer">Oferta</option>
                        <option value="Accepted">Aceita</option>
                        <option value="Rejected">Rejeitado</option>
                        <option value="Withdrawn">Retirada</option>
                        <option value="Closed">Encerrada</option>
                      </Select>
                    </EditField>
                    <EditField>
                      <EditLabel>Data de Aplicacao</EditLabel>
                      <TextInput
                        type="date"
                        value={metaDraft.date}
                        onChange={(e) =>
                          setMetaDraft({ ...metaDraft, date: e.target.value })
                        }
                      />
                    </EditField>
                    <EditField>
                      <EditLabel>Localizacao</EditLabel>
                      <TextInput
                        value={metaDraft.location}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            location: e.target.value,
                          })
                        }
                        placeholder="Remoto, Sao Paulo, etc."
                      />
                    </EditField>
                    <EditField style={{ gridColumn: "1 / -1" }}>
                      <EditLabel>Link Externo</EditLabel>
                      <TextInput
                        value={metaDraft.externalLink}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            externalLink: e.target.value,
                          })
                        }
                        placeholder="https://..."
                      />
                    </EditField>
                  </EditGrid>
                  <FormActions>
                    <SmallButton
                      type="button"
                      variant="primary"
                      onClick={() => handleSaveMeta()}
                    >
                      <Save size={16} /> Salvar
                    </SmallButton>
                    <SmallButton
                      type="button"
                      variant="ghost"
                      onClick={handleCancelMeta}
                    >
                      <X size={16} /> Cancelar
                    </SmallButton>
                  </FormActions>
                </>

              ) : (
                <>
                  <EditField style={{ marginBottom: "16px" }}>
                    <EditLabel>Versao do CV</EditLabel>
                    <TextInput
                      value={job.cvVersion || ""}
                      readOnly
                      placeholder="CV_FullStack_v3"
                    />
                  </EditField>

                  {null /* Campo 'Mensagem Enviada?' removido para alinhar com schema backend */}

                  <EditField style={{ marginBottom: "16px" }}>
                    <EditLabel>Proxima Fase</EditLabel>
                    <Select
                      value={metaDraft.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value as JobStatus;
                        setMetaDraft({
                          ...metaDraft,
                          status: nextStatus,
                        });
                        handleSaveMeta({ status: nextStatus });
                      }}
                    >
                      <option value="Lead">Lead (Salva)</option>
                      <option value="Applied">Aplicada</option>
                      <option value="Viewed">Visualizada</option>
                      <option value="Contacted">Contatado</option>
                      <option value="Interview">Entrevista</option>
                      <option value="TechnicalTest">Teste Tecnico</option>
                      <option value="Offer">Oferta</option>
                      <option value="Accepted">Aceita</option>
                      <option value="Rejected">Rejeitado</option>
                      <option value="Withdrawn">Retirada</option>
                      <option value="Closed">Encerrada</option>
                    </Select>
                  </EditField>

                  <SmallButton
                    type="button"
                    variant="primary"
                    style={{ width: "100%", marginBottom: "16px" }}
                    onClick={() => {
                      notesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                      notesRef.current?.focus();
                    }}
                  >
                    Adicionar nota
                  </SmallButton>

                  <SmallButton
                    type="button"
                    variant="ghost"
                    style={{ width: "100%" }}
                    onClick={() => job && toggleArchive(job.id)}
                  >
                    {job.archived ? "Desarquivar" : "Arquivar"} Candidatura
                  </SmallButton>
                </>
              )}
            </Panel>

            <Panel>
              <SectionTitle>
                <Clock size={20} />
                Linha do tempo
              </SectionTitle>
              <TimelineList>
                {(job.history ?? timelineEvents).map((event, index, arr) => {
                  const isCustomEvent = job.history && index < job.history.length;
                  const Icon = resolveIcon(event.icon);
                  const displaySubtitle = (event as any).createdAt
                    ? `${event.subtitle} ? Criado em ${formatDate(
                        (event as any).createdAt as string
                      )}`
                    : event.subtitle;
                  return (
                    <TimelineItem key={`${event.title}-${index}`}>
                      {index < arr.length - 1 && <TimelineConnector />}
                      <TimelineIconWrapper>
                        <Icon size={14} />
                      </TimelineIconWrapper>
                      <TimelineItemHeader>
                        <TimelineText>
                          <TimelineTitle>{event.title}</TimelineTitle>
                          <TimelineSubtitle>{displaySubtitle}</TimelineSubtitle>
                        </TimelineText>
                        {isCustomEvent && (
                          <IconButton
                            type="button"
                            onClick={() => handleRemoveHistory(index)}
                            title="Remover evento"
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        )}
                      </TimelineItemHeader>
                    </TimelineItem>
                  );
                })}
              </TimelineList>
              <InlineForm onSubmit={handleAddHistory} style={{ marginTop: 12 }}>
                <Select
                  value={newHistory.title}
                  onChange={(e) => {
                    setNewHistory((p) => ({ ...p, title: e.target.value }));
                    if (e.target.value !== "__custom__") {
                      setCustomTitle("");
                    }
                  }}
                  required
                >
                  <option value="">Selecione o evento</option>
                  {PREDEFINED_EVENTS.map((event) => (
                    <option key={event.title} value={event.title}>
                      {event.title}
                    </option>
                  ))}
                  <option value="__custom__">+ Titulo personalizado</option>
                </Select>
                {newHistory.title === "__custom__" && (
                  <TextInput
                    placeholder="Digite o titulo personalizado"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    required
                  />
                )}
                <TextInput
                  placeholder="Descricao / data"
                  value={newHistory.subtitle}
                  onChange={(e) =>
                    setNewHistory((p) => ({ ...p, subtitle: e.target.value }))
                  }
                />
                <SmallButton type="submit" variant="primary">
                  Adicionar evento
                </SmallButton>
              </InlineForm>
            </Panel>

            <Panel>
              <SectionTitle>
                <LinkIcon size={20} />
                Recursos
              </SectionTitle>
              <ResourceList>
                {resources.length === 0 && (
                  <ListEmpty>Nenhum recurso adicionado</ListEmpty>
                )}
                {resources.map((resource, index) => (
                  <ListItem key={`${resource.label}-${index}`}>
                    <ListItemText>
                      <strong>{resource.label}</strong>
                      {resource.href && (
                        <a
                          href={resource.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {resource.href}
                        </a>
                      )}
                    </ListItemText>
                    <SmallButton
                      type="button"
                      variant="ghost"
                      onClick={() => job && removeResource(job.id, index)}
                    >
                      Remover
                    </SmallButton>
                  </ListItem>
                ))}
              </ResourceList>
              <InlineForm
                onSubmit={handleAddResource}
                style={{ marginTop: 10 }}
              >
                <TextInput
                  placeholder="Nome do recurso"
                  value={newResource.label}
                  onChange={(e) =>
                    setNewResource((p) => ({ ...p, label: e.target.value }))
                  }
                />
                <TextInput
                  placeholder="URL"
                  value={newResource.href}
                  onChange={(e) =>
                    setNewResource((p) => ({ ...p, href: e.target.value }))
                  }
                />
                <SmallButton type="submit" variant="primary">
                  Adicionar
                </SmallButton>
              </InlineForm>
            </Panel>

            <ReminderCard>
              <ReminderEyebrow>Lembrete Estrategico</ReminderEyebrow>
              <List style={{ color: "#fff" }}>
                {(job.reminders ?? []).length === 0 && (
                  <ListEmpty style={{ color: "#e5e7eb" }}>
                    Nenhum lembrete
                  </ListEmpty>
                )}
                {(job.reminders ?? []).map((reminder, index) => (
                  <ListItem
                    key={`${reminder}-${index}`}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  >
                    <ListItemText style={{ color: "#fff" }}>
                      {reminder}
                    </ListItemText>
                    <SmallButton
                      type="button"
                      variant="ghost"
                      onClick={() => job && removeReminder(job.id, index)}
                    >
                      Remover
                    </SmallButton>
                  </ListItem>
                ))}
              </List>
              <InlineForm
                onSubmit={handleAddReminder}
                style={{ marginTop: 10 }}
              >
                <TextInput
                  placeholder="Novo lembrete"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                />
                <SmallButton type="submit" variant="primary">
                  Adicionar
                </SmallButton>
              </InlineForm>
              <ReminderIcon>
                <PartyPopper size={120} />
              </ReminderIcon>
            </ReminderCard>
          </Sidebar>
        </Layout>
      </Container>

      {/* Modal de Edicao Completa */}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Candidatura"
        footer={
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button type="submit" form="edit-job-form">
              Salvar Alterações
            </Button>
            <Button variant="ghost" onClick={handleCloseEditModal}>
              Cancelar
            </Button>
          </div>
        }
      >
        <form id="edit-job-form" onSubmit={handleSubmitEdit}>
          <div style={{ maxHeight: "600px", overflow: "auto", paddingRight: "8px" }}>
            <Tabs
              tabs={[
                {
                  id: "basic",
                  label: "Básico",
                  content: (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <EditField>
                        <EditLabel>Nome da Empresa *</EditLabel>
                        <TextInput
                          required
                          value={editFormState.company || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                          placeholder="Ex: Google, Nubank..."
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Cargo *</EditLabel>
                        <TextInput
                          required
                          value={editFormState.title || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Ex: UX Designer"
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Trilha *</EditLabel>
                        <Select
                          value={editFormState.track || "AI"}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              track: e.target.value as JobTrack,
                            }))
                          }
                        >
                          {Object.entries(trackLabels).map(([track, label]) => (
                            <option key={track} value={track}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </EditField>

                      <EditField>
                        <EditLabel>Status *</EditLabel>
                        <Select
                          value={editFormState.status || "Applied"}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              status: e.target.value as JobStatus,
                            }))
                          }
                        >
                          <option value="Lead">Lead (Salva)</option>
                          <option value="Applied">Aplicada</option>
                          <option value="Viewed">Visualizada</option>
                          <option value="Contacted">Contatado</option>
                          <option value="Interview">Entrevista</option>
                          <option value="TechnicalTest">Teste Técnico</option>
                          <option value="Offer">Oferta</option>
                          <option value="Accepted">Aceita</option>
                          <option value="Rejected">Rejeitado</option>
                          <option value="Withdrawn">Retirada</option>
                          <option value="Closed">Encerrada</option>
                        </Select>
                      </EditField>

                      <EditField>
                        <EditLabel>Data de Aplicacao *</EditLabel>
                        <TextInput
                          type="date"
                          required
                          value={editFormState.date || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({ ...prev, date: e.target.value }))
                          }
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Localizacao</EditLabel>
                        <TextInput
                          value={editFormState.location || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Ex: Remoto, Sao Paulo..."
                        />
                      </EditField>

                      <EditField style={{ gridColumn: "1 / -1" }}>
                        <EditLabel>Link Externo</EditLabel>
                        <TextInput
                          type="url"
                          value={editFormState.externalLink || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              externalLink: e.target.value,
                            }))
                          }
                          placeholder="https://..."
                        />
                      </EditField>
                    </div>
                  ),
                },
                {
                  id: "details",
                  label: "Detalhes",
                  content: (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <EditField>
                        <EditLabel>Descrição da Vaga</EditLabel>
                        <TextArea
                          value={editFormState.description || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Resumo geral sobre a vaga..."
                          rows={3}
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Responsabilidades (uma por linha)</EditLabel>
                        <TextArea
                          value={(editFormState.responsibilities || []).join("\n")}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              responsibilities: e.target.value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Ex: Desenvolver features&#10;Revisar PRs&#10;Mentorear junior"
                          rows={4}
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Benefícios (um por linha)</EditLabel>
                        <TextArea
                          value={(editFormState.benefits || []).join("\n")}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              benefits: e.target.value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Ex: Vale refeição&#10;Gympass&#10;Desenvolvimento contínuo"
                          rows={3}
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Informações Adicionais</EditLabel>
                        <TextArea
                          value={editFormState.additionalInfo || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              additionalInfo: e.target.value,
                            }))
                          }
                          placeholder="Outros detalhes relevantes sobre a vaga..."
                          rows={3}
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>Notas internas (uma por linha)</EditLabel>
                        <TextArea
                          value={(editFormState.notes || []).join("\n")}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              notes: e.target.value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Ex: Falei com o recrutador na segunda"
                          rows={3}
                        />
                      </EditField>
                    </div>
                  ),
                },
                {
                  id: "hiring",
                  label: "Contratação",
                  content: (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <EditField>
                        <EditLabel>Modelo de Trabalho</EditLabel>
                        <Select
                          value={editFormState.workModel || "remote"}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              workModel: e.target.value as "remote" | "hybrid" | "on-site",
                            }))
                          }
                        >
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="on-site">On-site</option>
                        </Select>
                      </EditField>

                      <EditField>
                        <EditLabel>Tipo de Contratacao</EditLabel>
                        <Select
                          value={editFormState.employmentType || "Unknown"}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              employmentType: e.target.value as "FullTime" | "PartTime" | "Contract" | "Internship" | "Unknown",
                            }))
                          }
                        >
                          <option value="FullTime">FullTime</option>
                          <option value="PartTime">PartTime</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Unknown">Unknown</option>
                        </Select>
                      </EditField>

                      <EditField>
                        <EditLabel>Senioridade</EditLabel>
                        <Select
                          value={editFormState.seniority || "Unknown"}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              seniority: e.target.value as "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Unknown",
                            }))
                          }
                        >
                          <option value="Intern">Intern</option>
                          <option value="Junior">Junior</option>
                          <option value="Mid">Mid</option>
                          <option value="Senior">Senior</option>
                          <option value="Lead">Lead</option>
                          <option value="Unknown">Unknown</option>
                        </Select>
                      </EditField>

                      <EditField style={{ gridColumn: "1 / -1" }}>
                        <EditLabel>Recrutador(a)</EditLabel>
                        <TextInput
                          value={editFormState.recruiterName || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              recruiterName: e.target.value,
                            }))
                          }
                          placeholder="Nome do contato do recrutador"
                        />
                      </EditField>

                      <EditField style={{ gridColumn: "1 / -1" }}>
                        <EditLabel>Data de Postagem</EditLabel>
                        <TextInput
                          type="datetime-local"
                          value={editFormState.postedAt || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              postedAt: e.target.value,
                            }))
                          }
                        />
                      </EditField>
                    </div>
                  ),
                },
                {
                  id: "operations",
                  label: "Operação",
                  content: (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <EditField>
                        <EditLabel>Prioridade</EditLabel>
                        <Select
                          value={editFormState.priority || "P2"}
                          onChange={(e) =>
                            setEditFormState((prev) => ({
                              ...prev,
                              priority: e.target.value as "P1" | "P2" | "P3",
                            }))
                          }
                        >
                          <option value="P1">P1</option>
                          <option value="P2">P2</option>
                          <option value="P3">P3</option>
                        </Select>
                      </EditField>

                      <EditField>
                        <EditLabel>Versao do CV</EditLabel>
                        <TextInput
                          value={editFormState.cvVersion || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({ ...prev, cvVersion: e.target.value }))
                          }
                          placeholder="Ex: CV_AI_v3"
                        />
                      </EditField>

                      <EditField>
                        <EditLabel>
                          <input
                            type="checkbox"
                            checked={!!editFormState.archived}
                            onChange={(e) =>
                              setEditFormState((prev) => ({ ...prev, archived: e.target.checked }))
                            }
                          />
                          {" Arquivado"}
                        </EditLabel>
                      </EditField>

                      <EditField>
                        <EditLabel>Proximo follow-up</EditLabel>
                        <TextInput
                          type="datetime-local"
                          value={editFormState.nextFollowUpAt || ""}
                          onChange={(e) =>
                            setEditFormState((prev) => ({ ...prev, nextFollowUpAt: e.target.value }))
                          }
                        />
                      </EditField>
                    </div>
                  ),
                },
              ]}
              activeTab={activeEditTab}
              onTabChange={setActiveEditTab}
            />
          </div>
        </form>
      </Modal>
    </Page>
  );
};

export default DetalhesCandidatura;

