import requests
import os

# GCFのHTTPトリガーURL
# 実際のGCFデプロイ後に取得できるURLに置き換えてください
GCF_URL = "https://us-central1-summary-d5734.cloudfunctions.net/handler"

# HTMLを保存するファイルのパス
# Firebase Hostingの公開ディレクトリ内に配置します
# 例: public/index.html
OUTPUT_FILE_PATH = "public/mlblog.html"

def fetch_and_save():
    """
    GCFのHTTPトリガーを呼び出し、取得したHTMLコンテンツをファイルに保存する。
    """
    print(f"Calling GCF at: {GCF_URL}")
    try:
        # GCFのHTTPトリガーを呼び出し
        response = requests.get(GCF_URL)
        response.raise_for_status() # HTTPエラーが発生した場合に例外を発生させる

        html_content = response.text
        print("Successfully fetched HTML content from GCF.")

        # 出力ディレクトリが存在しない場合は作成
        output_dir = os.path.dirname(OUTPUT_FILE_PATH)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"Created output directory: {output_dir}")

        # HTMLコンテンツをファイルに保存
        with open(OUTPUT_FILE_PATH, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"HTML content successfully saved to: {OUTPUT_FILE_PATH}")

    except requests.exceptions.RequestException as e:
        print(f"Error calling GCF or fetching data: {e}")
        # エラーが発生した場合はワークフローを失敗させるために例外を再発生させます
        raise
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        # エラーが発生した場合はワークフローを失敗させるために例外を再発生させます
        raise

if __name__ == "__main__":
    fetch_and_save()

