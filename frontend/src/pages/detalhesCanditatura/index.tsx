import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  MapPin,
  MessageSquare,
  PartyPopper,
  Save,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import type { Job } from "../../types";
import { formatDate } from "../../utils/formatDate";
import {
  ArchiveButton,
  ArchiveCard,
  BackButton,
  Container,
  FormActions,
  InlineForm,
  InfoCard,
  InfoGrid,
  InfoLabel,
  InfoLink,
  InfoValue,
  JobHeader,
  JobIdentity,
  Layout,
  Logo,
  MainColumn,
  MetaItem,
  MetaRow,
  Notes,
  Page,
  Panel,
  ReminderCard,
  ReminderEyebrow,
  ReminderIcon,
  ReminderText,
  ResourceButton,
  ResourceList,
  SectionTitle,
  Sidebar,
  SmallButton,
  StatusBadge,
  TextArea,
  TextInput,
  TimelineConnector,
  TimelineIconWrapper,
  TimelineItem,
  TimelineList,
  TimelineSubtitle,
  TimelineText,
  TimelineTitle,
  Title,
  TitleBlock,
  List,
  ListItem,
  ListItemText,
  ListEmpty,
  EditableTitle,
  EditField,
  EditLabel,
  EditGrid,
  IconButton,
  Select,
  TimelineItemHeader,
} from "./styles";

type TimelineEvent = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

type ResourceLink = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const statusToTone: Record<string, "yellow" | "green" | "blue"> = {
  Entrevista: "yellow",
  Aplicada: "blue",
  Oferta: "green",
  Recusada: "blue",
  Ghosted: "blue",
};

const statusToIcon: Record<string, LucideIcon> = {
  Entrevista: Clock,
  Aplicada: CheckCircle2,
  Oferta: CheckCircle2,
  Recusada: Activity,
  Ghosted: Activity,
};

const jobStatuses = ["Aplicada", "Entrevista", "Oferta", "Recusada", "Ghosted"];
const jobTracks = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "Design",
  "Dados",
];

const DetalhesCandidatura = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    jobs,
    updateJob,
    addHistoryEntry,
    addResource,
    removeResource,
    addReminder,
    removeReminder,
    toggleArchive,
  } = useJobs();

  const jobId = Number(id);
  const job = jobs.find((item) => item.id === jobId);

  const [notesDraft, setNotesDraft] = useState(job?.notes ?? "");
  const [newResource, setNewResource] = useState({ label: "", href: "" });
  const [newReminder, setNewReminder] = useState("");
  const [newHistory, setNewHistory] = useState({ title: "", subtitle: "" });
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [metaDraft, setMetaDraft] = useState({
    company: job?.company ?? "",
    position: job?.position ?? "",
    track: job?.track ?? "Frontend",
    status: job?.status ?? "Aplicada",
    date: job?.date ?? "",
    location: job?.location ?? "Remoto",
    externalLink: job?.externalLink ?? "",
  });

  useEffect(() => {
    setNotesDraft(job?.notes ?? "");
    if (job) {
      setMetaDraft({
        company: job.company,
        position: job.position,
        track: job.track,
        status: job.status,
        date: job.date,
        location: job.location ?? "Remoto",
        externalLink: job.externalLink ?? "",
      });
    }
  }, [job]);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!job)
      return [
        { title: "Aplicação", subtitle: "-", icon: CheckCircle2 },
        { title: "Status atual", subtitle: "-", icon: Clock },
      ];

    const statusIcon = statusToIcon[job.status] ?? Clock;
    return [
      {
        title: "Aplicação enviada",
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
    // Tenta voltar no histórico, mas se não houver histórico anterior, vai para o Dashboard
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSaveNotes = () => {
    if (!job) return;
    updateJob(job.id, { notes: notesDraft });
  };

  const handleSaveMeta = async () => {
    if (!job) return;

    const hasStatusChange = metaDraft.status !== job.status;
    const hasDateChange = metaDraft.date !== job.date;

    const patch = {
      company: metaDraft.company,
      position: metaDraft.position,
      track: metaDraft.track,
      status: metaDraft.status,
      date: metaDraft.date || job.date,
      location: metaDraft.location,
      externalLink: metaDraft.externalLink,
    } as Partial<Job>;

    let updatedHistory = job.history ? [...job.history] : undefined;

    if (hasDateChange) {
      const applicationIndex = updatedHistory?.findIndex(
        (entry) => entry.title === "Aplicação enviada" || entry.icon === "check"
      );

      const newCreatedAt = metaDraft.date
        ? new Date(metaDraft.date).toISOString()
        : job.date;

      if (
        applicationIndex !== undefined &&
        applicationIndex >= 0 &&
        updatedHistory
      ) {
        updatedHistory[applicationIndex] = {
          ...updatedHistory[applicationIndex],
          subtitle: formatDate(metaDraft.date || job.date),
          createdAt: newCreatedAt,
        };
      } else {
        const applicationEntry = {
          title: "Aplicação enviada",
          subtitle: formatDate(metaDraft.date || job.date),
          icon: "check" as const,
          createdAt: newCreatedAt,
        };
        updatedHistory = [applicationEntry, ...(updatedHistory ?? [])];
      }
    }

    if (hasStatusChange) {
      const now = new Date().toISOString();
      const newHistoryEntry = {
        title: `Status alterado para ${metaDraft.status}`,
        subtitle: `Mudou de "${job.status}" para "${
          metaDraft.status
        }" em ${formatDate(now)}`,
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

    // Se apenas a data mudou, garante que o draft reflita o valor salvo
    if (hasDateChange) {
      setMetaDraft((prev) => ({ ...prev, date: patch.date as string }));
    }

    setIsEditingMeta(false);
  };

  const handleCancelMeta = () => {
    if (job) {
      setMetaDraft({
        company: job.company,
        position: job.position,
        track: job.track,
        status: job.status,
        date: job.date,
        location: job.location ?? "Remoto",
        externalLink: job.externalLink ?? "",
      });
    }
    setIsEditingMeta(false);
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
    if (!job || !newHistory.title || !newHistory.subtitle) return;
    addHistoryEntry(job.id, {
      ...newHistory,
      icon: "activity",
      createdAt: new Date().toISOString(),
    });
    setNewHistory({ title: "", subtitle: "" });
  };

  const handleRemoveHistory = (index: number) => {
    if (!job || !job.history) return;
    const newHistory = job.history.filter((_, i) => i !== index);
    updateJob(job.id, { history: newHistory });
  };

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
              Candidatura não encontrada
            </SectionTitle>
            <Notes>
              Não localizamos os dados da candidatura. Tente voltar e selecionar
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
              {isEditingMeta ? (
                <>
                  <SectionTitle>
                    <Edit3 size={20} />
                    Editando Metadados
                  </SectionTitle>
                  <EditGrid>
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
                        placeholder="Título da vaga"
                      />
                    </EditField>
                    <EditField>
                      <EditLabel>Trilha</EditLabel>
                      <Select
                        value={metaDraft.track}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            track: e.target.value as any,
                          })
                        }
                      >
                        {jobTracks.map((track) => (
                          <option key={track} value={track}>
                            {track}
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
                        {jobStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </EditField>
                    <EditField>
                      <EditLabel>Data de Aplicação</EditLabel>
                      <TextInput
                        type="date"
                        value={metaDraft.date}
                        onChange={(e) =>
                          setMetaDraft({ ...metaDraft, date: e.target.value })
                        }
                      />
                    </EditField>
                    <EditField>
                      <EditLabel>Localização</EditLabel>
                      <TextInput
                        value={metaDraft.location}
                        onChange={(e) =>
                          setMetaDraft({
                            ...metaDraft,
                            location: e.target.value,
                          })
                        }
                        placeholder="Remoto, São Paulo, etc."
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
                      onClick={handleSaveMeta}
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
                  <JobHeader>
                    <JobIdentity>
                      <Logo>
                        <Building2 size={32} />
                      </Logo>
                      <TitleBlock>
                        <EditableTitle>
                          <Title>{job.position}</Title>
                          <IconButton
                            type="button"
                            onClick={() => setIsEditingMeta(true)}
                            title="Editar metadados"
                          >
                            <Edit3 size={16} />
                          </IconButton>
                        </EditableTitle>
                        <MetaRow>
                          <MetaItem>
                            <Building2 size={14} /> {job.company}
                          </MetaItem>
                          <MetaItem>
                            <MapPin size={14} /> {job.location ?? "Remoto"}
                          </MetaItem>
                        </MetaRow>
                      </TitleBlock>
                    </JobIdentity>
                    <StatusBadge tone={statusToTone[job.status] ?? "blue"}>
                      {job.status}
                    </StatusBadge>
                  </JobHeader>

                  <InfoGrid>
                    <InfoCard>
                      <InfoLabel>Data de Aplicação</InfoLabel>
                      <InfoValue>
                        <Calendar size={14} /> {formatDate(job.date)}
                      </InfoValue>
                    </InfoCard>

                    <InfoCard>
                      <InfoLabel>Trilha principal</InfoLabel>
                      <InfoValue>{job.track}</InfoValue>
                    </InfoCard>

                    <InfoCard>
                      <InfoLabel>Link Externo</InfoLabel>
                      {job.externalLink ? (
                        <InfoLink
                          href={job.externalLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink size={14} /> Ver anúncio original
                        </InfoLink>
                      ) : (
                        <InfoValue>—</InfoValue>
                      )}
                    </InfoCard>
                  </InfoGrid>
                </>
              )}

              <SectionTitle>
                <MessageSquare size={20} />
                Anotações do Candidato
              </SectionTitle>
              <Notes>
                <TextArea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Adicione anotações sobre a candidatura..."
                />
                <FormActions style={{ marginTop: 10 }}>
                  <SmallButton
                    type="button"
                    variant="primary"
                    onClick={handleSaveNotes}
                  >
                    Salvar anotações
                  </SmallButton>
                </FormActions>
              </Notes>
            </Panel>

            <Panel>
              <SectionTitle>
                <Clock size={20} />
                Histórico do Processo
              </SectionTitle>
              <TimelineList>
                {(job.history ?? timelineEvents).map((event, index, arr) => {
                  const isCustomEvent =
                    job.history && index < job.history.length;
                  const displaySubtitle = event.createdAt
                    ? `${event.subtitle} • Criado em ${formatDate(
                        event.createdAt
                      )}`
                    : event.subtitle;
                  return (
                    <TimelineItem key={`${event.title}-${index}`}>
                      {index < arr.length - 1 && <TimelineConnector />}
                      <TimelineIconWrapper>
                        <event.icon size={14} />
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
                <TextInput
                  placeholder="Título do evento"
                  value={newHistory.title}
                  onChange={(e) =>
                    setNewHistory((p) => ({ ...p, title: e.target.value }))
                  }
                />
                <TextInput
                  placeholder="Descrição / data"
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
          </MainColumn>

          <Sidebar>
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
              <ReminderEyebrow>Lembrete Estratégico</ReminderEyebrow>
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

            <ArchiveCard>
              <ArchiveButton
                type="button"
                onClick={() => job && toggleArchive(job.id)}
              >
                {job.archived
                  ? "Desarquivar Candidatura"
                  : "Arquivar Candidatura"}
              </ArchiveButton>
              {job.archived && (
                <ListEmpty style={{ marginTop: 8 }}>
                  Esta candidatura está arquivada.
                </ListEmpty>
              )}
            </ArchiveCard>
          </Sidebar>
        </Layout>
      </Container>
    </Page>
  );
};

export default DetalhesCandidatura;
