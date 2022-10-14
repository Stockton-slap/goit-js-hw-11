const BASE_URL = 'https://pixabay.com';

export function fetchPics(name, page, perPage) {
  const params = new URLSearchParams({
    key: '30589696-b681d27f2a9352756d0078443',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });

  return fetch(`${BASE_URL}/api?${params}`).then(response => response.json());
}
