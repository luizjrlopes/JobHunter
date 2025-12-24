import { useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Download,
  Ghost,
  Plus,
  Search,
  TrendingUp,
  Upload,
} from "lucide-react";
import Button from "../../components/Button";
import StatCard from "../../components/Card";
import JobsTable from "../../components/Table";
import Modal from "../../components/Modal";
import { jobStatuses, jobTracks, useJobs } from "../../hooks/useJobs";
import type { Job, JobStatus } from "../../types";
import { formatDate } from "../../utils/formatDate";
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
type StatCardType = "total" | "process" | "offers" | "ghosted";

const todayIso = new Date().toISOString().split("T")[0];

const defaultFormState = {
  company: "",
  position: "",
  track: jobTracks[0],
  status: jobStatuses[0],
  date: todayIso,
  location: "",
  externalLink: "",
  notes: "",
};

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
    exportBackup,
    importBackup,
  } = useJobs();

  const [formState, setFormState] = useState(defaultFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<StatCardType | null>(null);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDelete = (id: number) => deleteJob(id);

  const handleExportFile = () => exportBackup();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importBackup(file);
    } catch (error) {
      console.error(error);
      alert("Falha ao importar backup. Verifique o arquivo.");
    }
  };

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
    { value: "month", label: "Mês atual" },
    { value: "week", label: "Últimos 7 dias" },
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

  const getFilteredJobsByPeriod = (list: Job[], period: PeriodFilter) => {
    const start = getPeriodStart(period);
    const now = new Date();
    return list.filter((job) => {
      const jobDate = toLocalDate(job.date);
      return jobDate >= start && jobDate <= now;
    });
  };

  const hasNoRecentActivity = (job: Job): boolean => {
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    if (job.history && job.history.length > 0) {
      const last = job.history[job.history.length - 1];
      if (last.createdAt) {
        return new Date(last.createdAt) < fifteenDaysAgo;
      }
    }
    return toLocalDate(job.date) < fifteenDaysAgo;
  };

  const ghostedJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      if (job.status === "Ghosted") return true;
      if (job.status === "Aplicada" || job.status === "Entrevista") {
        return hasNoRecentActivity(job);
      }
      return false;
    });
  }, [activeJobs]);

  const modalJobs = useMemo(() => {
    if (!modalType) return [];

    if (modalType === "ghosted") {
      return ghostedJobs;
    }

    let pool: Job[] = [];
    if (modalType === "total") {
      pool = jobs; // inclui arquivadas
    } else if (modalType === "process") {
      pool = activeJobs.filter(
        (job) => job.status === "Aplicada" || job.status === "Entrevista"
      );
    } else if (modalType === "offers") {
      pool = activeJobs.filter((job) => job.status === "Oferta");
    }

    return getFilteredJobsByPeriod(pool, periodFilter);
  }, [activeJobs, ghostedJobs, modalType, periodFilter]);

  const statChips = useMemo(
    () => [
      {
        label: "Aplicações no mês",
        value: stats.total,
        hint: "Meta: 10/semana",
        icon: BriefcaseBusiness,
        tone: "indigo" as const,
        type: "total" as StatCardType,
      },
      {
        label: "Em processo",
        value: stats.process,
        hint: "Aplicada + Entrevista",
        icon: Clock3,
        tone: "amber" as const,
        type: "process" as StatCardType,
      },
      {
        label: "Ofertas",
        value: stats.offers,
        hint: "Recebidas no mês",
        icon: CheckCircle2,
        tone: "green" as const,
        type: "offers" as StatCardType,
      },
      {
        label: "Sem resposta",
        value: stats.ghosted,
        hint: "15+ dias sem retorno",
        icon: Ghost,
        tone: "gray" as const,
        type: "ghosted" as StatCardType,
      },
    ],
    [stats]
  );

  const updateTrack = (track: Job["track"] | "Todas") =>
    updateFilters({ track });
  const updateStatus = (status: JobStatus | "Todas") =>
    updateFilters({ status });

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
            <Button variant="ghost" onClick={handleExportFile}>
              <Download size={18} /> Exportar
            </Button>
            <Button
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} /> Importar
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: "none" }}
            />
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
                    {track}
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
                    {status}
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
        />

        {filteredArchivedJobs.length > 0 && (
          <Panel style={{ marginTop: 16 }}>
            <SectionTitle>Arquivadas</SectionTitle>
            <JobsTable
              jobs={filteredArchivedJobs}
              onDelete={handleDelete}
              onToggleArchive={toggleArchive}
            />
          </Panel>
        )}
      </Container>

      <Modal
        open={isModalOpen}
        title={
          modalType === "total"
            ? "Aplicações do período"
            : modalType === "process"
            ? "Candidaturas em processo"
            : modalType === "offers"
            ? "Candidaturas com oferta"
            : modalType === "ghosted"
            ? "Sem resposta (+15 dias)"
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
                Nenhuma candidatura encontrada para este período.
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
                      <strong>{job.position}</strong>
                      <span style={{ color: "#6b7280" }}>{job.company}</span>
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
            <FormGrid>
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
                  value={formState.position}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      position: e.target.value,
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
                      track: e.target.value as any,
                    }))
                  }
                >
                  {jobTracks.map((track) => (
                    <option key={track} value={track}>
                      {track}
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
                      status: e.target.value as any,
                    }))
                  }
                >
                  {jobStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Data de Aplicação *</Label>
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
                <Label>Localização</Label>
                <Input
                  value={formState.location}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Ex: Remoto, São Paulo, Híbrido..."
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

              <Field style={{ gridColumn: "1 / -1" }}>
                <Label>Anotações Iniciais</Label>
                <TextArea
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Adicione observações sobre a vaga, requisitos, contato do recrutador, etc..."
                  rows={4}
                />
              </Field>
            </FormGrid>
          </form>
        )}
      </Modal>
    </Page>
  );
};

export default Dashboard;
