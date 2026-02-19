class errorResponse extends Error
{
  constructor(message,statuscode)
  {
    super(message);
    this.statuscode;
  }
}
export default errorResponse