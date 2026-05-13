import { ALLANIME_API, ALLANIME_REFR, USER_AGENT } from './constants';

export async function gqlPost<T>(query: string, variables: object): Promise<T> {
  const res = await fetch(`${ALLANIME_API}/api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      Referer: ALLANIME_REFR,
      Origin: ALLANIME_REFR,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`allanime API ${res.status}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`allanime GraphQL: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}
