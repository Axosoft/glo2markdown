module.exports = (board, cards) => {
  let markdown = '';

  markdown += `# ${board.name} \n`;

  for(let column of board.columns) {
    markdown += `## ${column.name} \n`;
    const columnCards = cards.filter(card => column.id === card.column_id);

    for (let card of columnCards){
      markdown += `### ${card.name} \n`
      if (card.members.length){
        markdown += `#### Assignees \n`
        for (let member of card.members){
          const memberInfo = board.members.find((boardMem) => member.id === boardMem.id);
          if (memberInfo){
            markdown += `* ${memberInfo.name} \n`
          }
        }
      }

      if (card.labels.length){
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
