class ProfilesController < ApplicationController
  before_action :set_profile, only: [:edit, :show, :update]
  before_action :authenticate_user!, except: [:show]
  before_action :require_same_user, only: [:edit, :update]
  
  def edit
    if @profile.cholesterol_histories.nil?
      @profile.cholesterol_histories.build
    end
    if @profile.medications.nil?
      @profile.medications.build
    end
  end
  
  def show
    @psa_histories = @profile.psa_histories
    @total_cholesterol_histories = @profile.cholesterol_histories.select(:total_cholesterol, :month, :year)
    @hdl_histories = @profile.cholesterol_histories.select(:hdl, :month, :year)
    @ldl_histories = @profile.cholesterol_histories.select(:ldl, :month, :year)
    @triglyceride_histories = @profile.cholesterol_histories.select(:triglyceride, :month, :year)
    @glucose_histories = @profile.cholesterol_histories.select(:glucose, :month, :year)
  end
  
  def update
    if params[:profile][:psa_histories_attributes]
      message = "Your PSA History has been successfully updated"
      render_path = 'psa_histories/index'
    elsif @profile.empty?
      message = "Your profile has been successfully created"
      render_path = 'edit'
    else
      message = "Your profile has been successfully updated"
      render_path = 'edit'
    end
    if @profile.update(profile_params)
      flash[:success] = message
      redirect_to profile_path(@profile)
    else
      render render_path
    end
    
  end
  
  private
  
  def set_profile
    @profile = Profile.find(params[:id])
  end
  
  def profile_params
    params.require(:profile).permit(:first_name, :last_name, :birth_year, :city, :administrative_division,
    :country, :years_in_current_locale, :ancestral_descent, :race, :ethnicity, :age_noticed_symptoms, 
    :age_urinary_malfunction, :age_bladder_infection, :story, :psa_histories_attributes => [:id, :psa, :month, :year, :_destroy],
    :cholesterol_histories_attributes => [:id, :total_cholesterol, :hdl, :ldl, :triglyceride, :glucose, :month, :year, :_destroy],
    :medications_attributes => [:id, :purpose, :age_recommended, :age_prescribed, :name, :strength, :dosage, :month_last_used,
    :year_last_used, :still_using, :_destroy])
  end
  
  def require_same_user
    if current_user != @profile.user and !current_user.admin?
      flash[:danger] = "You can only edit or delete your own profile"
      redirect_to root_path
    end
  end
  
end