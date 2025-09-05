export async function requestTextFile(url: string): Promise<string> {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/plain'
        }
    });

    const responseText = await response.text();
    return responseText;
}

type ImageFormat = 'jpeg' | 'png' | 'gif' | string;

export async function requestImageFile(
    url: string,
    format?: ImageFormat
): Promise<Blob> {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'same-origin',
        headers: {
            'Content-Type': format != null ? 
                `image/${format}` : undefined             
        }
    });

    const responseContentType = response.headers.get('Content-Type');
    if (responseContentType && responseContentType.startsWith('image/')) {
        format = responseContentType.slice('image/'.length);
    } 

    const responseData = await response.arrayBuffer();

    return new Blob([responseData], { 
        type: responseContentType || `image/${format}` 
    });
}