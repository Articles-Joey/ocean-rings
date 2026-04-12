import useSWR from "swr";

const fetcher = (obj) => {
    const url = new URL(obj.url, window.location.origin);
    if (obj.game) {
        url.searchParams.append("game", obj.game);
    }
    return fetch(url.toString(), {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        });
};

const options = {
    dedupingInterval: ((1000 * 60) * 30),
    // fallbackData: []
}

const useGameScoreboard = (params) => {

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        params?.game ?
            {
                url: "/api/community/games/scoreboard",
                game: params.game,
            }
            :
            null,
        fetcher,
        options
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    };
};

export default useGameScoreboard;