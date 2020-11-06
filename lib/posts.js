import fs from 'fs'
import html from 'remark-html'
import matter from 'gray-matter'
import path from 'path'
import remark from 'remark'

const postsDirectory = path.join(process.cwd(), 'posts')

/**
 * ポストを日付でソートする。
 * @returns {Array<object>} ポストのファイル名とメタデータ
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

/**
 * @returns {Array<object>} ファイル名含むオブジェクト
 */
export function getAllPostIds() {
    // /posts/ 配下のファイル名を取得
    const fileNames = fs.readdirSync(postsDirectory)
    
    // ファイル名の配列を返却
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

/**
 * @param {string} ポストのファイル名
 * @returns {Array<object>} ポストのファイル名とhtmlとメタデータ
 */
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
  
    // ポストのメタデータ取得
    const matterResult = matter(fileContents)

    // remarkを利用しmarkdownからhtmlに変換する
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()
  
    // idとメタデータを返却
    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}