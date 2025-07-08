<?php
// Get species list from API
$speciesList = [];
$speciesApiUrl = "https://aes.shenlu.me/api/v1/species";
$speciesResponse = file_get_contents($speciesApiUrl);
if ($speciesResponse !== false) {
    $speciesList = json_decode($speciesResponse, true);
}
?>

<h1 style="text-align:center; font-family:sans-serif; margin-top:40px;">Amazing Endemic Species</h1>
<div style="display:flex; justify-content:center; margin-top:30px;">
    <form action="api.php" method="get" style="display:flex; align-items:center; background:#fff; border-radius:32px; box-shadow:0 2px 8px rgba(0,0,0,0.10); padding:10px 18px; max-width:600px; width:100%; border:1px solid #eee; gap:10px;">
        <select id="endpoint" name="endpoint" style="padding:8px 12px; border-radius:20px; border:1px solid #ccc; font-size:15px;">
            <option value="random">Random</option>
            <option value="explore">Explore</option>
            <!-- Add more endpoints as needed -->
        </select>
        <input type="text" id="query" name="query" placeholder="Search Query..." style="flex:1; padding:8px 16px; border-radius:20px; border:1px solid #ccc; font-size:15px;">
        <button type="submit" style="background:#007bff; color:#fff; border:none; border-radius:20px; padding:8px 28px; font-size:16px; font-weight:bold; cursor:pointer;">Search</button>
    </form>
</div>

<?php if (!empty($speciesList) && is_array($speciesList)): ?>
    <div style="max-width:800px; margin:40px auto 0; display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:24px;">
        <?php foreach ($speciesList as $species): ?>
            <div style="background:#fff; border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,0.08); padding:20px; border:1px solid #eee; font-family:sans-serif;">
                <?php if (!empty($species['image'])): ?>
                    <img src="<?php echo htmlspecialchars($species['image']); ?>" alt="Image" style="width:100%; max-height:180px; object-fit:cover; border-radius:12px; margin-bottom:12px;">
                <?php endif; ?>
                <h3 style="margin-top:0; margin-bottom:10px;"><?php echo htmlspecialchars($species['common_name'] ?? 'Unknown'); ?></h3>
                <p style="margin:6px 0;"><strong>ID:</strong> <?php echo htmlspecialchars($species['id'] ?? ''); ?></p>
                <p style="margin:6px 0;"><strong>Scientific Name:</strong> <?php echo htmlspecialchars($species['scientific_name'] ?? ''); ?></p>
                <p style="margin:6px 0;"><strong>Conservation Status:</strong> <?php echo htmlspecialchars($species['conservation_status'] ?? ''); ?></p>
                <p style="margin:6px 0;"><strong>Group:</strong> <?php echo htmlspecialchars($species['group'] ?? ''); ?></p>
                <p style="margin:6px 0;"><strong>ISO Code:</strong> <?php echo htmlspecialchars($species['iso_code'] ?? ''); ?></p>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>