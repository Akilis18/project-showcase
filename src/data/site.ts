// Publish only confirmed profile details; missing values render a pending state.
export const site = {
  title: 'Project Showcase',
  description: '以專案記錄開發過程、技術選擇與實作成果。',
  name: '', about: '', skills: [] as string[],
  socials: [] as { label: string; url: string }[],
  repository: 'https://github.com/Akilis18/project-showcase',
};
