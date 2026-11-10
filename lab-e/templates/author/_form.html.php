<?php
    /** @var $author ?\App\Model\Author */
    // Wygenerowane claude opus 5.5
?>

<div class="form-group">
    <label for="first_name">First name</label>
    <input type="text" id="first_name" name="author[first_name]" value="<?= $author ? htmlspecialchars((string) $author->getFirstName()) : '' ?>">
</div>

<div class="form-group">
    <label for="last_name">Last name</label>
    <input type="text" id="last_name" name="author[last_name]" value="<?= $author ? htmlspecialchars((string) $author->getLastName()) : '' ?>">
</div>

<div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="author[email]" value="<?= $author ? htmlspecialchars((string) $author->getEmail()) : '' ?>">
</div>

<div class="form-group">
    <label for="photo_url">Photo URL</label>
    <input type="url" id="photo_url" name="author[photo_url]" placeholder="https://..." value="<?= $author ? htmlspecialchars((string) $author->getPhotoUrl()) : '' ?>">
</div>

<div class="form-group">
    <label for="photo_credit">Photo credit</label>
    <input type="text" id="photo_credit" name="author[photo_credit]" placeholder="Author, license, source" value="<?= $author ? htmlspecialchars((string) $author->getPhotoCredit()) : '' ?>">
</div>

<div class="form-group">
    <label for="bio">Bio</label>
    <textarea id="bio" name="author[bio]"><?= $author ? htmlspecialchars((string) $author->getBio()) : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>