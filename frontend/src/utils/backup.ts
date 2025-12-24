import type { Job } from "../types";

export const exportJobsToJSON = (jobs: Job[]): void => {
  const dataStr = JSON.stringify(jobs, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const timestamp = new Date().toISOString().split("T")[0];
  const link = document.createElement("a");
  link.href = url;
  link.download = `jobhunter-backup-${timestamp}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const importJobsFromJSON = (file: File): Promise<Job[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jobs = JSON.parse(e.target?.result as string) as Job[];
        resolve(jobs);
      } catch (error) {
        reject(new Error("Arquivo JSON inválido"));
      }
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
};

export const autoBackupJobs = (jobs: Job[]): void => {
  // Backup automático a cada mudança importante
  const lastBackup = localStorage.getItem("last-backup-date");
  const today = new Date().toISOString().split("T")[0];

  if (lastBackup !== today) {
    // Salvar em localStorage secundário para backup de emergência
    localStorage.setItem("jobhunter-backup", JSON.stringify(jobs));
    localStorage.setItem("last-backup-date", today);
  }
};
