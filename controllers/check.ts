const check = async ({
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  response.status = 200;
  response.body = "running";
};

export { check }
