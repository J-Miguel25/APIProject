
<?php
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : 'random';
if (isset($_GET['query'])) {
    $url = 'https://aes.shenlu.me/api/v1/' . $endpoint;
    $query_fields = [
        'q' => $_GET['query']
    ];

    if ($_GET['query'] == "") {
        $curl = curl_init($url);
    } else {
        $curl = curl_init($url . '?' . http_build_query($query_fields));
    }

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);

    // Set header and return raw API JSON
    header('Content-Type: application/json');
    echo $response;
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No query provided.']);
}
?>