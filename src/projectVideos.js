export const PROJECT_VIDEOS = {
  'Grafika-projekat': {
    src: 'videos/Mamuti na ostrvu - projekat iz računarske grafike.mp4?v=2',
    type: 'video/mp4',
  },
  Optimal_block_packing: {
    src: 'videos/Optimal_block_packing.mkv?v=2',
    type: 'video/x-matroska',
  },
  Tavern_Tower: {
    src: 'videos/Tavern_tower.mkv?v=2',
    type: 'video/x-matroska',
    playbackRate: 2,
  },
  score_sheet: {
    src: 'videos/Score_sheet.mp4?v=2',
    type: 'video/mp4',
    centered: true,
  },
  TicTacToe: {
    src: 'videos/TicTacToe.mp4',
    type: 'video/mp4',
  },
};

export const REPOS_WITH_VIDEO = new Set(Object.keys(PROJECT_VIDEOS));
