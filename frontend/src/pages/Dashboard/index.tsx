import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Ghost,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import Button from "../../components/Button";
import StatCard from "../../components/Card";
import JobsTable from "../../components/Table";
import Modal from "../../components/Modal";
import { Tabs } from "../../components/Tabs";
import { jobStatuses, jobTracks, useJobs } from "../../hooks/useJobs";
import { IN_PROGRESS_STATUS, OFFER_STATUSES } from "../../constants/jobStatusSets";
import { useAuth } from "../../hooks/useAuth";
import type {
  Job,
  JobStatus,
  JobTrack,
  JobResource,
  JobTimelineEntry,
} from "../../types";
import { formatDate } from "../../utils/formatDate";

// Mapeamento de status em inglês para português
const statusLabels: Record<JobStatus, string> = {
  Lead: "Lead (Salva)",
  Applied: "Aplicada",
  Viewed: "Visualizada",
  Contacted: "Contatado",
  Interview: "Entrevista",
  TechnicalTest: "Teste Técnico",
  Offer: "Oferta",
  Accepted: "Aceita",
  Rejected: "Rejeitado",
  Withdrawn: "Retirada",
  Closed: "Encerrada",
};
import {
  Brand,
  BrandIcon,
  BrandSubtitle,
  BrandText,
  BrandTitle,
  Container,
  Field,
  FiltersGroup,
  FiltersRow,
  FormGrid,
  Header,
  HeaderActions,
  HeaderInner,
  Input,
  Label,
  ModalActions,
  Page,
  Panel,
  SearchIconWrapper,
  SearchInput,
  SearchWrapper,
  SectionTitle,
  Select,
  StatsGrid,
  TextArea,
} from "./styles";

export type PeriodFilter = "year" | "month" | "week" | "day";
type StatCardType = "total" | "process" | "offers" | "ghosted" | "leads";

type FormState = {
  // Básico
  title: string;
  company: string;
  track: JobTrack;
  status: JobStatus;
  date?: string;
  location?: string;
  externalLink?: string;

  // Detalhes da vaga
  description?: string;
  responsibilities?: string[];
  benefits?: string[];
  additionalInfo?: string;
  notes?: string[];

  // Contratação
  employmentType?: "FullTime" | "PartTime" | "Contract" | "Internship" | "Unknown";
  workModel?: "remote" | "hybrid" | "on-site";
  seniority?: "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Unknown";
  recruiterName?: string;
  postedAt?: string;

  // Operação
  priority?: "P1" | "P2" | "P3";
  cvVersion?: string;
  nextFollowUpAt?: string;
  archived?: boolean;

  resources?: JobResource[];
  reminders?: string[];
  history?: JobTimelineEntry[];
};

const todayIso = new Date().toISOString().split("T")[0];

const defaultFormState: FormState = {
  title: "",
  company: "",
  track: jobTracks[0],
  status: jobStatuses[0],
  date: todayIso,
  location: "",
  externalLink: "",
  description: "",
  responsibilities: [],
  benefits: [],
  additionalInfo: "",
  notes: [],
  employmentType: "Unknown",
  workModel: "remote",
  seniority: "Unknown",
  recruiterName: "",
  postedAt: "",
  priority: "P2",
  cvVersion: "",
  nextFollowUpAt: "",
  archived: false,
  resources: [],
  reminders: [],
  history: [],
};

const trackLabels: Record<JobTrack, string> = {
  AI: "IA / ML",
  FULL_STACK: "Full Stack",
  CLOUD: "Cloud",
};

const getCompany = (job: Job) => job.company ?? "";
const getRole = (job: Job) => job.title ?? "";

const Dashboard = () => {
  const {
    jobs,
    filteredJobs,
    filters,
    updateFilters,
    addJob,
    deleteJob,
    toggleArchive,
    stats,
  } = useJobs();
  const { logout } = useAuth();

  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<StatCardType | null>(null);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month");
  const [activeTab, setActiveTab] = useState<string>("basic");

  const activeJobs = useMemo(() => jobs.filter((job) => !job.archived), [jobs]);
  const filteredActiveJobs = useMemo(
    () => filteredJobs.filter((job) => !job.archived),
    [filteredJobs]
  );
  const filteredArchivedJobs = useMemo(
    () => filteredJobs.filter((job) => job.archived),
    [filteredJobs]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob(formState);
    setFormState(defaultFormState);
    setIsModalOpen(false);
    setModalType(null);
  };

  const handleDelete = (id: string) => deleteJob(id);

  const openModal = (type: StatCardType) => {
    setModalType(type);
    setPeriodFilter("month");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const periodOptions = [
    { value: "year", label: "Ano atual" },
    { value: "month", label: "Mes atual" },
    { value: "week", label: "Ultimos 7 dias" },
    { value: "day", label: "Hoje" },
  ];

  const getPeriodStart = (period: PeriodFilter) => {
    const now = new Date();
    if (period === "day")
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === "week")
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    if (period === "month")
      return new Date(now.getFullYear(), now.getMonth(), 1);
    return new Date(now.getFullYear(), 0, 1);
  };

  const toLocalDate = (dateStr: string) =>
    dateStr.includes("T") ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);

  const getFilteredJobsByPeriod = (
    list: Job[],
    period: PeriodFilter,
    getDate: (job: Job) => Date
  ) => {
    const start = getPeriodStart(period);
    const now = new Date();
    return list.filter((job) => {
      const jobDate = getDate(job);
      return jobDate >= start && jobDate <= now;
    });
  };

  const getOfferEventDate = (job: Job): Date => {
    const keywords = [/proposta/i, /oferta/i, /offer/i, /aceit/i, /accepted/i];
    const offerEntry = (job.history ?? []).slice().reverse().find((e) => {
      const t = e.title ?? "";
      return keywords.some((k) => k.test(t));
    });
    if (offerEntry?.createdAt) return toLocalDate(offerEntry.createdAt);
    if (job.updatedAt) return toLocalDate(job.updatedAt);
    return toLocalDate(job.date);
  };

  const ghostedJobs = useMemo(() => {
    const now = new Date();
    return activeJobs.filter((job) => {
      if (!IN_PROGRESS_STATUS.includes(job.status)) return false;
      if (!job.nextFollowUpAt) return false;
      const next = toLocalDate(job.nextFollowUpAt);
      return next < now;
    });
  }, [activeJobs]);

  const modalJobs = useMemo(() => {
    if (!modalType) return [];

    if (modalType === "ghosted") {
      return ghostedJobs;
    }

    if (modalType === "process") {
      // Estado atual: sem filtro por período
      return activeJobs.filter((job) => IN_PROGRESS_STATUS.includes(job.status));
    }

    if (modalType === "total") {
      const pool = jobs.filter((job) => job.status !== "Lead");
      return getFilteredJobsByPeriod(pool, periodFilter, (job) => toLocalDate(job.date));
    }

    if (modalType === "offers") {
      const pool = activeJobs.filter((job) => OFFER_STATUSES.includes(job.status));
      return getFilteredJobsByPeriod(pool, periodFilter, getOfferEventDate);
    }

    if (modalType === "leads") {
      const pool = jobs.filter((job) => job.status === "Lead");
      return getFilteredJobsByPeriod(pool, periodFilter, (job) => toLocalDate(job.date));
    }

    return [];
  }, [activeJobs, ghostedJobs, modalType, periodFilter]);

  const statChips = useMemo(
    () => [
      {
        label: "Aplicacoes no mes",
        value: stats.total,
        hint: "Meta: 10/semana",
        icon: BriefcaseBusiness,
        tone: "indigo" as const,
        type: "total" as StatCardType,
      },
      {
        label: "Em processo",
        value: stats.process,
        hint: "Ativas",
        icon: Clock3,
        tone: "amber" as const,
        type: "process" as StatCardType,
      },
      {
        label: "Ofertas",
        value: stats.offers,
        hint: "Recebidas no mes",
        icon: CheckCircle2,
        tone: "green" as const,
        type: "offers" as StatCardType,
      },
      {
        label: "Sem resposta",
        value: stats.ghosted,
        hint: "Follow-up vencido",
        icon: Ghost,
        tone: "gray" as const,
        type: "ghosted" as StatCardType,
      },
      {
        label: "Leads do mes",
        value: stats.leads,
        hint: "Vagas salvas",
        icon: Search,
        tone: "indigo" as const,
        type: "leads" as StatCardType,
      },
    ],
    [stats]
  );

  const updateTrack = (track: JobTrack | "Todas") => updateFilters({ track });
  const updateStatus = (status: JobStatus | "Todas") => updateFilters({ status });

  return (
    <Page>
      <Header>
        <HeaderInner>
          <Brand>
            <BrandIcon>
              <TrendingUp />
            </BrandIcon>
            <BrandText>
              <BrandTitle>Job Hunter</BrandTitle>
              <BrandSubtitle>PAINEL DE CANDIDATURAS</BrandSubtitle>
            </BrandText>
          </Brand>

          <HeaderActions>
            <Button variant="ghost" onClick={logout}>
              Sair
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Nova Vaga
            </Button>
          </HeaderActions>
        </HeaderInner>
      </Header>

      <Container>
        <StatsGrid>
          {statChips.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
              onClick={() => openModal(stat.type)}
            />
          ))}
        </StatsGrid>

        <Panel>
          <SectionTitle>Controle de candidaturas</SectionTitle>
          <FiltersRow>
            <SearchWrapper>
              <SearchIconWrapper>
                <Search size={18} />
              </SearchIconWrapper>
              <SearchInput
                placeholder="Buscar por empresa ou cargo..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </SearchWrapper>

            <FiltersGroup>
              <Select
                value={filters.track}
                onChange={(e) => updateTrack(e.target.value as any)}
              >
                <option value="Todas">Todas as Trilhas</option>
                {jobTracks.map((track) => (
                  <option key={track} value={track}>
                    {trackLabels[track]}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.status}
                onChange={(e) => updateStatus(e.target.value as any)}
              >
                <option value="Todas">Todos Status</option>
                {jobStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </Select>
            </FiltersGroup>
          </FiltersRow>
        </Panel>

        <JobsTable
          jobs={filteredActiveJobs}
          onDelete={handleDelete}
          onToggleArchive={toggleArchive}
          trackLabels={trackLabels}
        />

        {filteredArchivedJobs.length > 0 && (
          <Panel style={{ marginTop: 16 }}>
            <SectionTitle>Arquivadas</SectionTitle>
            <JobsTable
              jobs={filteredArchivedJobs}
              onDelete={handleDelete}
              onToggleArchive={toggleArchive}
              trackLabels={trackLabels}
            />
          </Panel>
        )}
      </Container>

      <Modal
        open={isModalOpen}
        title={
          modalType === "total"
            ? "Aplicacoes do periodo"
            : modalType === "process"
            ? "Candidaturas em processo"
            : modalType === "offers"
            ? "Candidaturas com oferta"
            : modalType === "ghosted"
            ? "Sem resposta (follow-up vencido)"
            : modalType === "leads"
            ? "Leads do periodo"
            : "Nova Vaga"
        }
        onClose={closeModal}
        footer={
          modalType ? (
            <ModalActions>
              <Button variant="ghost" onClick={closeModal}>
                Fechar
              </Button>
            </ModalActions>
          ) : (
            <ModalActions>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="job-form">
                Salvar Vaga
              </Button>
            </ModalActions>
          )
        }
      >
        {modalType ? (
          <div>
            {modalType !== "ghosted" && (
              <FiltersRow style={{ marginBottom: 12 }}>
                <FiltersGroup>
                  <Select
                    value={periodFilter}
                    onChange={(e) =>
                      setPeriodFilter(e.target.value as PeriodFilter)
                    }
                  >
                    {periodOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </FiltersGroup>
              </FiltersRow>
            )}
            {modalJobs.length === 0 ? (
              <p style={{ margin: 0, color: "#6b7280" }}>
                Nenhuma candidatura encontrada para este periodo.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {modalJobs.map((job) => (
                  <li
                    key={job.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      border: "1px solid rgba(229,231,235,0.9)",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <strong>{getRole(job)}</strong>
                      <span style={{ color: "#6b7280" }}>{getCompany(job)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        textAlign: "right",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{job.status}</span>
                      <small style={{ color: "#6b7280" }}>
                        {formatDate(job.date)}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <form id="job-form" onSubmit={handleSubmit}>
            <div style={{ maxHeight: "600px", overflow: "auto", paddingRight: "8px" }}>
              <Tabs
                tabs={[
                  {
                    id: "basic",
                    label: "Básico",
                    content: (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <Field>
                          <Label>Nome da Empresa *</Label>
                          <Input
                            required
                            value={formState.company}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                company: e.target.value,
                              }))
                            }
                            placeholder="Ex: Google, Nubank..."
                          />
                        </Field>

                        <Field>
                          <Label>Cargo *</Label>
                          <Input
                            required
                            value={formState.title}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Ex: UX Designer"
                          />
                        </Field>

                        <Field>
                          <Label>Trilha *</Label>
                          <Select
                            value={formState.track}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                track: e.target.value as JobTrack,
                              }))
                            }
                          >
                            {jobTracks.map((track) => (
                              <option key={track} value={track}>
                                {trackLabels[track]}
                              </option>
                            ))}
                          </Select>
                        </Field>

                        <Field>
                          <Label>Status Inicial *</Label>
                          <Select
                            value={formState.status}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                status: e.target.value as JobStatus,
                              }))
                            }
                          >
                            {jobStatuses.map((status) => (
                              <option key={status} value={status}>
                                {statusLabels[status]}
                              </option>
                            ))}
                          </Select>
                        </Field>

                        <Field>
                          <Label>Data de Aplicacao *</Label>
                          <Input
                            type="date"
                            required
                            value={formState.date}
                            onChange={(e) =>
                              setFormState((prev) => ({ ...prev, date: e.target.value }))
                            }
                          />
                        </Field>

                        <Field>
                          <Label>Localizacao</Label>
                          <Input
                            value={formState.location}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            placeholder="Ex: Remoto, Sao Paulo..."
                          />
                        </Field>

                        <Field style={{ gridColumn: "1 / -1" }}>
                          <Label>Link Externo</Label>
                          <Input
                            type="url"
                            value={formState.externalLink}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                externalLink: e.target.value,
                              }))
                            }
                            placeholder="https://..."
                          />
                        </Field>
                      </div>
                    ),
                  },
                  {
                    id: "details",
                    label: "Detalhes",
                    content: (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Field>
                          <Label>Descrição da Vaga</Label>
                          <TextArea
                            value={formState.description}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Resumo geral sobre a vaga..."
                            rows={3}
                          />
                        </Field>

                        <Field>
                          <Label>Responsabilidades (uma por linha)</Label>
                          <TextArea
                            value={formState.responsibilities.join("\n")}
                            onChange={(e) =>
                              setFormState((prev) => ({
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
                        </Field>

                        <Field>
                          <Label>Benefícios (um por linha)</Label>
                          <TextArea
                            value={formState.benefits.join("\n")}
                            onChange={(e) =>
                              setFormState((prev) => ({
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
                        </Field>

                        <Field>
                          <Label>Informações Adicionais</Label>
                          <TextArea
                            value={formState.additionalInfo}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                additionalInfo: e.target.value,
                              }))
                            }
                            placeholder="Outros detalhes relevantes sobre a vaga..."
                            rows={3}
                          />
                        </Field>

                        <Field>
                          <Label>Notas internas (uma por linha)</Label>
                          <TextArea
                            value={(formState.notes ?? []).join("\n")}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                notes: e.target.value
                                  .split("\n")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }))
                            }
                            placeholder="Ex: Falei com o recrutador na segunda\nEmpresa prefere presencial às quartas"
                            rows={3}
                          />
                        </Field>
                      </div>
                    ),
                  },
                  {
                    id: "hiring",
                    label: "Contratação",
                    content: (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <Field>
                          <Label>Modelo de Trabalho</Label>
                          <Select
                            value={formState.workModel}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                workModel: e.target.value as FormState["workModel"],
                              }))
                            }
                          >
                            {(["remote", "hybrid", "on-site", "unknown"] as const).map((wm) => (
                              <option key={wm} value={wm}>
                                {wm.charAt(0).toUpperCase() + wm.slice(1)}
                              </option>
                            ))}
                          </Select>
                        </Field>

                        <Field>
                          <Label>Tipo de Contratacao</Label>
                          <Select
                            value={formState.employmentType}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                employmentType: e.target.value as FormState["employmentType"],
                              }))
                            }
                          >
                            {(
                              [
                                "FullTime",
                                "PartTime",
                                "Contract",
                                "Internship",
                                "Unknown",
                              ] as const
                            ).map((et) => (
                              <option key={et} value={et}>
                                {et}
                              </option>
                            ))}
                          </Select>
                        </Field>

                        <Field>
                          <Label>Senioridade</Label>
                          <Select
                            value={formState.seniority}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                seniority: e.target.value as FormState["seniority"],
                              }))
                            }
                          >
                            {(["Intern", "Junior", "Mid", "Senior", "Lead", "Unknown"] as const).map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              )
                            )}
                          </Select>
                        </Field>

                        <Field style={{ gridColumn: "1 / -1" }}>
                          <Label>Recrutador(a)</Label>
                          <Input
                            value={formState.recruiterName}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                recruiterName: e.target.value,
                              }))
                            }
                            placeholder="Nome do contato do recrutador"
                          />
                        </Field>

                        <Field style={{ gridColumn: "1 / -1" }}>
                          <Label>Data de Postagem</Label>
                          <Input
                            type="datetime-local"
                            value={formState.postedAt}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                postedAt: e.target.value,
                              }))
                            }
                          />
                        </Field>
                      </div>
                    ),
                  },
                  {
                    id: "operations",
                    label: "Operação",
                    content: (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <Field>
                          <Label>Prioridade</Label>
                          <Select
                            value={formState.priority}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                priority: e.target.value as FormState["priority"],
                              }))
                            }
                          >
                            {["P1", "P2", "P3"].map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </Select>
                        </Field>

                        <Field>
                          <Label>Versao do CV</Label>
                          <Input
                            value={formState.cvVersion}
                            onChange={(e) =>
                              setFormState((prev) => ({ ...prev, cvVersion: e.target.value }))
                            }
                            placeholder="Ex: CV_AI_v3"
                          />
                        </Field>

                        <Field>
                          <Label>
                            <input
                              type="checkbox"
                              checked={!!formState.archived}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, archived: e.target.checked }))
                              }
                            />
                            {" Arquivar ao criar?"}
                          </Label>
                        </Field>

                        <Field>
                          <Label>Proximo follow-up</Label>
                          <Input
                            type="datetime-local"
                            value={formState.nextFollowUpAt}
                            onChange={(e) =>
                              setFormState((prev) => ({ ...prev, nextFollowUpAt: e.target.value }))
                            }
                          />
                        </Field>
                      </div>
                    ),
                  },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </form>
        )}
      </Modal>
    </Page>
  );
};

export default Dashboard;


