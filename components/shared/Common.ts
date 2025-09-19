export const finishSelect = (data: any) => {
  const result = data.map((x: any) => {
    return { id: x.name.toLowerCase(), label: x.name };
  });
  console.log(result);
  return result;
};
