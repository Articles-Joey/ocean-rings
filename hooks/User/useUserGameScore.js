import useSWR from "swr";

// import { useSelector, useDispatch } from 'react-redux';

// import axios from "axios";
import { minutesToMilliseconds } from "date-fns";

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

const useUserGameScore = (params) => {

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    const { data, error, isLoading, mutate } = useSWR(
        ((userReduxState?._id && params.game) ?
            {
                url: "/api/user/community/games/scoreboard/get",
                game: `${params.game}`
            }
            :
            null
        ),
        fetcher,
        {
            dedupingInterval: minutesToMilliseconds(10),
            focusThrottleInterval: minutesToMilliseconds(10),
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useUserGameScore;