import React, { useMemo } from "react";
import $ from 'jquery';
import Series from "./Series";

const Content = () => {
	// Memoize the tab content components
	const MemoizedSeries = useMemo(() => <Series />, []);

	$(document).on('click', "ul.tabs li", function () {
        var $this = $(this);
        var $theTab = $(this).attr("data-tab");
        if ($this.hasClass("active")) {
        } else {
            $this
                .closest(".tabs-wrapper")
                .find("ul.tabs li, .tabs-container .tab-content")
                .removeClass("active");
            $(
                '.tabs-container .tab-content[id="' +
                $theTab +
                '"], ul.tabs li[data-tab="' +
                $theTab +
                "]"
            ).addClass("active");
        }
        $(this).addClass("active");
    });

	return (
		<>
			{/* { loading ? <Loader /> :  */}
				<>
					{MemoizedSeries}
					{/* <section id="Content-section" className="about-content-section section">
						<div className="tabs-wrapper">
							<ul className="tabs">
								<li className="active" data-tab="tab1">Movie</li>
								<li data-tab="tab2">TV Show</li>
							</ul>
							<div className="tabs-container">
								<div id="tab1" className="tab-content active">
									{MemoizedMovie}
								</div>
								<div id="tab2" className="tab-content">
									{MemoizedSeries}
								</div>
							</div>
						</div>
					</section> */}
				</>
			{/* } */}
		</>
	);
};

export default Content;
