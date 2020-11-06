import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

/**
 * ポストを日付でソートする。
 * @returns {Array} ポストのファイル名とメタデータ
 */
export function getSortedPostsData() {
    // /posts/ 配下のファイル名を取得
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // idを取得するために`.md`を削除
        const id = fileName.replace(/\.md$/, '')

        // 文字列としてmarkdown読み込む
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // gray-matter を使用してメタデータを取得
        const matterResult = matter(fileContents)

        // idとメタデータを返却
        return {
            id,
            ...matterResult.data
        }
    })

    // 日付でポストをソート
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}