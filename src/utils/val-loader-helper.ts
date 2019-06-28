// typing only we needed
type Payload = {
  code: string | Buffer;
  cacheable: boolean;
};

type Gen<T> = () => Promise<T>;

const JSONFile = <T>(cacheable: boolean, gen: Gen<T>) => async (): Promise<Payload> => ({
  code: JSON.stringify(await gen()),
  cacheable,
});

export default JSONFile;
