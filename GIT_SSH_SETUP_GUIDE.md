## Gitリポジトリの管理 (SSHキー方式)

このプロジェクトをSSHキー方式でGit管理する場合の手順です。
これにより、HTTPS接続での認証（ユーザー名/パスワードやPAT）の代わりに、より安全で便利なSSHキー認証を使用できます。
コマンドはVS Codeのターミナル (Git BashやPowerShellなど) で実行することを前提としています。

### 1. SSHキーペアの生成 (未作成の場合)

ターミナルで以下のコマンドを実行し、SSHキーペアを作成します。

```bash
# ed25519形式のキーを生成 (推奨)
ssh-keygen -t ed25519 -C "alapripon@gmail.com"
```

実行すると、キーの保存場所（デフォルトは `~/.ssh/id_ed25519`）とパスフレーズの入力を求められます。
パスフレーズは任意ですが、設定するとセキュリティが向上します。Enterキーで進めるとパスフレーズなしで作成されます。

### 2. GitHubアカウントへの公開鍵の登録

1.  生成された公開鍵（例: `~/.ssh/id_ed25519.pub`）の内容をクリップボードにコピーします。
    *   **Git Bash の場合:**
        ```bash
        cat ~/.ssh/id_ed25519.pub
        ```
        表示された内容を手動でコピーします。
    *   **PowerShell の場合:**
        ```powershell
        Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
        ```

2.  GitHubにログインし、右上のアイコンから [Settings] > [SSH and GPG keys] (左側メニュー) > [New SSH key] ボタンを選択します。
3.  「Title」に任意の名前（例: `VSCode-Terminal-MLB-Graph` など、どのマシン・環境のキーか分かる名前）を入力し、「Key type」は `Authentication Key` のまま、「Key」のテキストエリアにコピーした公開鍵を貼り付けて [Add SSH key] ボタンで登録します。

### 3. リポジトリのリモートURLをSSH形式で追加

```bash
# "your-github-username" と "your-repository-name" は実際のGitHubユーザー名とリポジトリ名に置き換えてください
git remote add origin git@github.com:himemogu/mlblog.git
```
現在のリモートURLは `git remote -v` で確認できます。新規にクローンする場合は、最初からSSH形式のURL (`git@github.com:your-github-username/your-repository-name.git`) を使用してください。

### 4. 接続テスト (任意)

以下のコマンドでGitHubへのSSH接続が成功するか確認できます。
```bash
ssh -T git@github.com
```
`Hi your-github-username! You've successfully authenticated, but GitHub does not provide shell access.` のようなメッセージが表示されれば成功です。

これで、`git push` や `git pull` などの操作がSSH経由で行われるようになります。