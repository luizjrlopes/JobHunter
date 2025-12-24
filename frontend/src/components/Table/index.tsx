import { Calendar, Trash2 } from "lucide-react";
import Button from "../Button";
import Badge from "../Badge";
import { formatDate } from "../../utils/formatDate";
import type { Job } from "../../types";
import {
  Body,
  Cell,
  CompanyAvatar,
  CompanyCell,
  CompanyInfo,
  CompanyName,
  DateText,
  EmptyState,
  EmptyText,
  EmptyTitle,
  Head,
  HeadCell,
  Row,
  ScrollArea,
  StyledTable,
  TableContainer,
  TrackTag,
  Position,
  LinkOverlay,
} from "./styles";

interface TableProps {
  jobs: Job[];
  onDelete: (id: number) => void;
  onToggleArchive?: (id: number) => void;
}

const JobsTable = ({ jobs, onDelete, onToggleArchive }: TableProps) => (
  <TableContainer>
    <ScrollArea>
      <StyledTable>
        <Head>
          <tr>
            <HeadCell>Empresa / Cargo</HeadCell>
            <HeadCell>Trilha</HeadCell>
            <HeadCell>Status</HeadCell>
            <HeadCell>Data</HeadCell>
            <HeadCell style={{ textAlign: "right" }}>Acoes</HeadCell>
          </tr>
        </Head>
        <Body>
          {jobs.map((job) => (
            <Row key={job.id}>
              <Cell>
                <CompanyCell>
                  <LinkOverlay to={`/detalhes/${job.id}`}>
                    <CompanyAvatar>{job.company.charAt(0)}</CompanyAvatar>
                    <CompanyInfo>
                      <Position>{job.position}</Position>
                      <CompanyName>{job.company}</CompanyName>
                    </CompanyInfo>
                  </LinkOverlay>
                </CompanyCell>
              </Cell>
              <Cell>
                <TrackTag>{job.track}</TrackTag>
              </Cell>
              <Cell>
                <Badge status={job.status}>{job.status}</Badge>
              </Cell>
              <Cell>
                <DateText>
                  <Calendar size={14} />
                  {formatDate(job.date)}
                </DateText>
              </Cell>
              <Cell align="right">
                {onToggleArchive && (
                  <Button
                    variant="ghost"
                    aria-label={`${job.archived ? "Desarquivar" : "Arquivar"} ${
                      job.company
                    }`}
                    onClick={() => onToggleArchive(job.id)}
                    style={{ marginRight: 8 }}
                  >
                    {job.archived ? "Desarquivar" : "Arquivar"}
                  </Button>
                )}
                <Button
                  variant="icon"
                  aria-label={`Remover ${job.company}`}
                  onClick={() => onDelete(job.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </Cell>
            </Row>
          ))}
        </Body>
      </StyledTable>
    </ScrollArea>
    {jobs.length === 0 && (
      <EmptyState>
        <EmptyTitle>Nenhuma vaga encontrada</EmptyTitle>
        <EmptyText>
          Tente ajustar seus filtros ou adicione uma nova vaga.
        </EmptyText>
      </EmptyState>
    )}
  </TableContainer>
);

export default JobsTable;
