



export const fetchGithubProfile = async () => {
    const response = await fetch('https://api.github.com/users/dlx20/repos')
    const data = await response.json()

    return data

}