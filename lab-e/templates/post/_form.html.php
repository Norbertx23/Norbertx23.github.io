<?php
    /** @var $post ?\App\Model\Post */
    /** @var $authors \App\Model\Author[] */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="post[subject]" value="<?= $post ? $post->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="post[content]"><?= $post? $post->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="author_id">Author</label>
    <select id="author_id" name="post[author_id]">
        <option value="">-- none --</option>
        <?php foreach ($authors as $author): ?>
            <option value="<?= $author->getId() ?>" <?= $post && $post->getAuthorId() === $author->getId() ? 'selected' : '' ?>>
                <?= htmlspecialchars($author->getFullName()) ?>
            </option>
        <?php endforeach; ?>
    </select>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
