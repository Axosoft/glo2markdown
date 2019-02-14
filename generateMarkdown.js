module.exports = (board, cards) => {
  let markdown = '';

  markdown += `# ${board.name} \n`;

  for(let i = 0; i < board.columns.length; i++) {
    const column = board.columns[i]
    markdown += `## ${column.name} \n`;
    const columnCards = cards[i];

    for (let card of columnCards){
      markdown += `### ${card.name} \n`

      if (card.description && card.description.text !== '\n') {
        markdown += `#### Description \n`;
        markdown += `${card.description.text}`;
      }

      if (card.assignees && card.assignees.length){
        markdown += `#### Assignees \n`
        for (let assignee of card.assignees){
          const assigneeInfo = board.members.find((boardMem) => assignee.id === boardMem.id);
          if (assigneeInfo){
            markdown += `* ${assigneeInfo.username} \n`
          }
        }
      }

      if (card.labels && card.labels.length){
        markdown += `#### Labels \n`
        for (let label of card.labels){
          const labelInfo = board.labels.find((boardLabel) => label.id === boardLabel.id);
          if (labelInfo){
            markdown += `* ${labelInfo.name} \n`
          }
        }
      }
    }

  }
  return markdown;
};
